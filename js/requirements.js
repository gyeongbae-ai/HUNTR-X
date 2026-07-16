import { saveProfile } from "./auth.js";
import { escapeHtml, initAppShell, showToast } from "./common.js";
import {
  formatNumber,
  getEvidenceForRequirement,
  getRequirementItems,
  getStatus,
  OFFICIAL_SOURCES,
  REQUIREMENT_OPTIONS,
} from "./data.js";

const profile = initAppShell({ page: "requirements", title: "졸업요건 상세" });
if (!profile) throw new Error("Profile required");

const poomEvidence = getEvidenceForRequirement(profile, "poom").programs;
const poomGuides = {
  character: { title: "인성·리더십 또는 봉사 프로그램", href: "https://chsquare.skku.edu/challenge/nxui/index.html" },
  global: { title: "교환학생·글로벌 버디·국제행사", href: "https://chsquare.skku.edu/challenge/nxui/index.html" },
  creativity: { title: "창의·융합 프로젝트 또는 공모전", href: "programs.html" },
  ai: { title: "AI 비교과 또는 AICE 과정", href: "programs.html" },
  internship: { title: "Co-op·현장실습 프로그램", href: "https://tollgate.skku.edu/" },
};

const editableIds = new Set([
  "totalCredits",
  "coreGeneral",
  "balancedGeneral",
  "dsEducation",
  "primaryMajor",
  "secondaryMajor",
  "internationalTotal",
  "internationalMajor",
]);

function statusBadge(item) {
  const status = getStatus(item);
  if (item.exception && status === "complete") return `<span class="badge badge-info">학과 지정 예외</span>`;
  if (item.exception) return `<span class="badge badge-${status}">예외 과목 미충족</span>`;
  const text = status === "complete" ? "충족" : status === "warning" ? "보완 필요" : "부족";
  return `<span class="badge badge-${status === "complete" ? "success" : status}">${text}</span>`;
}

function requirementLabel(id) {
  return REQUIREMENT_OPTIONS.find((item) => item.id === id)?.label || id;
}

function courseSourceLabel(course) {
  return course.verified ? `${course.source} · 공식 대조` : course.source;
}

function renderCourseEvidenceGapNotice() {
  const gaps = profile.courseEvidenceGaps || [];
  if (!gaps.length) return "";
  const labels = gaps
    .slice(0, 4)
    .map((gap) => `${gap.label} ${formatNumber(gap.missingCredits)}학점`)
    .join(" · ");
  return `
    <div class="alert alert-warning" style="margin-bottom:14px">
      총 이수학점 요약값과 세부 교과목 합계가 아직 완전히 일치하지 않습니다. 임의 과목을 생성하지 않고, 원본 GLS 성적표에서 확인 가능한 과목만 표시합니다.
      추가 확인 필요: ${escapeHtml(labels)}${gaps.length > 4 ? " 외" : ""}
    </div>`;
}

function renderEditableRows() {
  return getRequirementItems(profile)
    .filter((item) => editableIds.has(item.id))
    .map(
      (item) => `
        <div class="editable-row" data-item-id="${item.id}">
          <div class="editable-label"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.description)}</span></div>
          <input aria-label="${escapeHtml(item.label)} 현재 이수" type="number" min="0" step="1" value="${item.completed}" data-field="completed" />
          <span class="ratio-separator">/</span>
          <input aria-label="${escapeHtml(item.label)} 필요 기준" type="number" min="1" step="1" value="${item.required}" data-field="required" />
          <div class="editable-status">${statusBadge(item)}</div>
        </div>`,
    )
    .join("");
}

function renderRequirementEvidence(item) {
  const evidence = getEvidenceForRequirement(profile, item.id);
  const isPoom = item.id === "poom";
  const count = isPoom ? evidence.programs.length : evidence.courses.length;
  const summary = isPoom
    ? `${count}개 비교과 프로그램`
    : `${count}개 교과목 · ${formatNumber(evidence.credits)}학점`;

  return `
    <article class="requirement-evidence-detail" data-requirement-evidence="${item.id}">
      <div class="requirement-evidence-head">
        <div>
          <span class="evidence-kicker">${escapeHtml(item.label)}</span>
          <h3>${summary}</h3>
        </div>
        ${statusBadge(item)}
      </div>
      ${evidence.courses.length ? `
        <div class="evidence-table-wrap">
          <table class="evidence-table">
            <thead><tr><th>수강학기</th><th>학수번호</th><th>교과목명</th><th>학점</th><th>성적</th><th>출처</th></tr></thead>
            <tbody>${evidence.courses.map((course) => `
              <tr>
                <td>${escapeHtml(course.term)}</td>
                <td>${escapeHtml(course.code)}</td>
                <td><strong>${escapeHtml(course.name)}</strong></td>
                <td>${formatNumber(course.credits)}</td>
                <td><span class="grade-chip">${escapeHtml(course.grade)}</span></td>
                <td><span class="source-label">${escapeHtml(courseSourceLabel(course))}</span></td>
              </tr>`).join("")}</tbody>
          </table>
        </div>` : ""}
      ${evidence.programs.length ? `
        <div class="program-evidence-grid">
          ${evidence.programs.map((program) => `
            <div class="program-evidence-card">
              <span class="badge badge-success">${escapeHtml(program.certificationArea)} 영역</span>
              <strong>${escapeHtml(program.title)}</strong>
              <span>${escapeHtml(program.organizer)} · ${escapeHtml(program.completedAt)}</span>
              <small>${formatNumber(program.hours)}시간 이수 · ${escapeHtml(program.source)}</small>
            </div>`).join("")}
        </div>` : ""}
      ${count === 0 ? `<div class="empty-evidence"><strong>연결된 이수 내역이 없습니다.</strong><span>GLS 또는 챌린지스퀘어 이미지를 등록해 이 요건에 연결하세요.</span></div>` : ""}
      <div class="requirement-evidence-foot">
        <span>${escapeHtml(item.description || "학교 기준과 이수내역을 함께 확인합니다.")}</span>
        <strong>${formatNumber(item.completed)} / ${formatNumber(item.required)}${escapeHtml(item.suffix || "")}</strong>
      </div>
    </article>`;
}

function renderPoomServiceCard(item) {
  const linked = poomEvidence.filter((program) => program.certificationArea === item.label);
  const guide = poomGuides[item.id] || poomGuides.creativity;
  return `
    <article class="poom-service-card ${item.completed ? "completed" : ""}" data-poom-card="${item.id}">
      <div class="poom-service-head">
        <span class="poom-service-icon">${escapeHtml(item.label.slice(0, 1))}</span>
        <label class="compact-check"><input type="checkbox" data-poom="${item.id}" ${item.completed ? "checked" : ""} /><span>인증 완료</span></label>
      </div>
      <h3>${escapeHtml(item.label)} 영역</h3>
      <p class="poom-service-state" data-poom-state="${item.id}">${item.completed ? "챌린지스퀘어 기준 완료로 입력됨" : "아직 인증되지 않은 영역"}</p>
      ${linked.length
        ? `<div class="linked-activity-list">${linked.map((program) => `<div><strong>${escapeHtml(program.title)}</strong><span>${formatNumber(program.hours)}시간 · ${escapeHtml(program.completedAt)}</span></div>`).join("")}</div>`
        : `<div class="poom-recommendation"><span>추천 활동</span><strong>${escapeHtml(guide.title)}</strong></div>`}
      <a class="text-link" href="${guide.href}" ${guide.href.startsWith("http") ? `target="_blank" rel="noreferrer"` : ""}>${linked.length ? "인정 상태 확인" : "활동 찾아보기"}</a>
    </article>`;
}

function renderEvaluationSteps() {
  return profile.graduationEvaluation.checklist.map((item, index) => `
    <article class="evaluation-step-card ${item.completed ? "completed" : ""}" data-evaluation-card="${index}">
      <div class="evaluation-step-number">${String(index + 1).padStart(2, "0")}</div>
      <div class="evaluation-step-copy">
        <strong>${escapeHtml(item.label)}</strong>
        <span data-evaluation-state="${index}">${item.completed ? "완료된 단계" : "다음 확인이 필요한 단계"}</span>
      </div>
      <label class="compact-check"><input type="checkbox" data-evaluation="${index}" ${item.completed ? "checked" : ""} /><span>완료</span></label>
    </article>`).join("");
}

const evidenceRequirementItems = getRequirementItems(profile).filter(
  (item) => !["registration", "gpa", "graduationEvaluation"].includes(item.id),
);

document.querySelector("#pageContent").innerHTML = `
  <div class="page-content">
    <div class="page-header">
      <div>
        <p class="eyebrow">Requirement details</p>
        <h1>내 졸업요건 상세</h1>
        <p>GLS 이수내역과 학교 기준을 대조해 현재 값과 실제 인정내역을 함께 확인하세요.</p>
      </div>
      <div class="page-header-actions">
        <a class="btn btn-secondary" href="evidence.html">이수 문서 등록</a>
        <button class="btn" id="saveRequirements" type="button">변경사항 저장</button>
      </div>
    </div>

    <div class="profile-strip">
      <div><strong>${escapeHtml(profile.admissionYear)}학번 · ${escapeHtml(profile.department)}</strong><span>${escapeHtml(profile.degreeTypeLabel)}${profile.secondaryProgram !== "없음" ? ` · ${escapeHtml(profile.secondaryProgram)}` : ""}</span></div>
      <a class="text-link" href="onboarding.html">전공 정보 수정</a>
    </div>

    ${profile.dsEducation.exception ? `<div class="alert" style="margin-bottom:18px"><strong>${escapeHtml(profile.dsEducation.exceptionLabel)}</strong><br />${escapeHtml(profile.dsEducation.detail)} · 두 과목 합계 6학점으로 DS 요건을 판정합니다.</div>` : ""}

    <div class="tabs" role="tablist">
      <button class="tab-button active" type="button" data-tab="credits">학점·교양</button>
      <button class="tab-button" type="button" data-tab="poom">3품 인증</button>
      <button class="tab-button" type="button" data-tab="evaluation">졸업평가</button>
      <button class="tab-button" type="button" data-tab="evidence">요건별 인정내역</button>
      <button class="tab-button" type="button" data-tab="courses">전체 교과목</button>
      <button class="tab-button" type="button" data-tab="sources">참고자료</button>
    </div>

    <section class="panel tab-panel" id="tab-credits">
      <div class="panel-header"><div><h2>학점 및 교육과정</h2><p>왼쪽은 현재 이수값, 오른쪽은 적용 기준입니다.</p></div></div>
      <div class="editable-requirements">${renderEditableRows()}</div>
      <div class="alert alert-warning" style="margin-top:16px">필요 기준을 직접 수정할 수 있지만 데모 편의를 위한 기능입니다. 실제 기준은 입학연도별 공식표를 우선합니다.</div>
    </section>

    <section class="panel tab-panel hidden" id="tab-poom">
      <div class="panel-header"><div><h2>3품제 인증</h2><p>영역별 이수내역과 다음 활동을 확인하고 최종 인증 상태를 직접 반영합니다.</p></div><span class="badge" id="poomCount"></span></div>
      <div class="service-progress-card">
        <div><span>현재 인증 현황</span><strong id="poomSummary">0/3개</strong></div>
        <div class="service-progress"><span id="poomProgressFill"></span></div>
        <a class="btn btn-secondary" href="programs.html">맞춤 비교과 찾기</a>
      </div>
      <div class="poom-service-grid">${profile.poom.map(renderPoomServiceCard).join("")}</div>
      <div class="alert" style="margin-top:16px">프로그램 이수와 3품 인증은 동일하지 않을 수 있습니다. 챌린지스퀘어의 최종 인증 상태를 확인한 뒤 체크하세요.</div>
    </section>

    <section class="panel tab-panel hidden" id="tab-evaluation">
      <div class="panel-header"><div><h2>${escapeHtml(profile.graduationEvaluation.label)}</h2><p>${escapeHtml(profile.graduationEvaluation.description)}</p></div><span class="badge" id="evaluationCount"></span></div>
      <div class="evaluation-overview">
        <div><span>졸업평가 진행률</span><strong id="evaluationSummary">0%</strong><p id="evaluationNextAction"></p></div>
        <div class="service-progress"><span id="evaluationProgressFill"></span></div>
        <div class="evaluation-actions"><a class="btn btn-secondary" href="assistant.html">AI에게 준비 순서 묻기</a><a class="btn btn-secondary" href="evidence.html">이수 문서 연결</a></div>
      </div>
      <div class="evaluation-step-list">${renderEvaluationSteps()}</div>
      ${profile.graduationEvaluation.timeline?.length ? `<div class="evaluation-timeline">${profile.graduationEvaluation.timeline.map((item) => `<div><span>${item.semester}학기</span><strong>${escapeHtml(item.label)}</strong></div>`).join("")}</div>` : ""}
      ${profile.notes.map((note) => `<div class="alert alert-warning" style="margin-top:10px">${escapeHtml(note)}</div>`).join("")}
    </section>

    <section class="tab-panel hidden" id="tab-evidence">
      <div class="evidence-tab-header">
        <div><p class="eyebrow">Evidence map</p><h2>요건마다 무엇으로 충족했는지 확인하세요</h2><p>같은 교과목이 총 졸업학점과 전공, 국제어수업처럼 여러 요건에 함께 인정될 수 있습니다.</p></div>
        <a class="btn" href="evidence.html">GLS·챌린지스퀘어 등록</a>
      </div>
      <div class="requirement-evidence-list">${evidenceRequirementItems.map(renderRequirementEvidence).join("")}</div>
    </section>

    <section class="panel tab-panel hidden" id="tab-courses">
      <div class="panel-header"><div><h2>전체 교과목·성적</h2><p>GLS에서 등록한 교과목과 각 과목이 인정되는 졸업요건을 함께 확인합니다.</p></div><a class="text-link" href="evidence.html">성적표 다시 등록</a></div>
      ${renderCourseEvidenceGapNotice()}
      <div class="evidence-table-wrap">
        <table class="course-table evidence-table">
          <thead><tr><th>상태</th><th>수강학기</th><th>학수번호</th><th>교과목명</th><th>학점</th><th>성적</th><th>인정요건</th><th>출처</th></tr></thead>
          <tbody>${profile.courses.map((course, index) => `<tr><td><input type="checkbox" data-course="${index}" ${course.completed ? "checked" : ""} aria-label="${escapeHtml(course.name)} 이수" /></td><td>${escapeHtml(course.term)}</td><td>${escapeHtml(course.code)}</td><td><strong>${escapeHtml(course.name)}</strong><span class="course-area-label">${escapeHtml(course.area)}</span></td><td>${formatNumber(course.credits)}</td><td><span class="grade-chip">${escapeHtml(course.grade)}</span></td><td><div class="requirement-chip-row">${(course.requirementIds || []).filter((id) => id !== "totalCredits").map((id) => `<span>${escapeHtml(requirementLabel(id))}</span>`).join("")}</div></td><td><span class="source-label">${escapeHtml(courseSourceLabel(course))}</span></td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>

    <section class="panel tab-panel hidden" id="tab-sources">
      <div class="panel-header"><div><h2>공식 참고자료</h2><p>진단 규칙을 정리할 때 우선 확인한 학교 자료입니다.</p></div></div>
      <ul class="source-list">
        ${OFFICIAL_SOURCES.map((source) => `<li class="task-item"><span class="task-dot" style="background:var(--green-700)"></span><div><strong>${escapeHtml(source.label)}</strong><span><a class="text-link" href="${source.url}" target="_blank" rel="noreferrer">원문 열기</a></span></div></li>`).join("")}
      </ul>
      <div class="alert" style="margin-top:16px">규정은 개정될 수 있으므로 서비스 데이터의 적용일과 학과별 최신 공지를 함께 확인해야 합니다.</div>
    </section>
  </div>`;

function refreshPoomCount() {
  const count = document.querySelectorAll("[data-poom]:checked").length;
  const badge = document.querySelector("#poomCount");
  badge.textContent = `${Math.min(count, 3)}/3 인증`;
  badge.className = `badge ${count >= 3 ? "badge-success" : "badge-warning"}`;
  document.querySelector("#poomSummary").textContent = `${count}개 인증`;
  document.querySelector("#poomProgressFill").style.width = `${Math.min(100, Math.round((count / 3) * 100))}%`;
  document.querySelectorAll("[data-poom]").forEach((input) => {
    const card = document.querySelector(`[data-poom-card="${input.dataset.poom}"]`);
    card?.classList.toggle("completed", input.checked);
    const state = document.querySelector(`[data-poom-state="${input.dataset.poom}"]`);
    if (state) state.textContent = input.checked ? "챌린지스퀘어 기준 완료로 입력됨" : "아직 인증되지 않은 영역";
  });
}

refreshPoomCount();
document.querySelectorAll("[data-poom]").forEach((input) => input.addEventListener("change", refreshPoomCount));

function refreshEvaluationProgress() {
  const inputs = [...document.querySelectorAll("[data-evaluation]")];
  const completed = inputs.filter((input) => input.checked).length;
  const percent = inputs.length ? Math.round((completed / inputs.length) * 100) : 0;
  const badge = document.querySelector("#evaluationCount");
  badge.textContent = `${completed}/${inputs.length} 단계`;
  badge.className = `badge ${completed === inputs.length ? "badge-success" : "badge-warning"}`;
  document.querySelector("#evaluationSummary").textContent = `${percent}%`;
  document.querySelector("#evaluationProgressFill").style.width = `${percent}%`;
  const next = inputs.find((input) => !input.checked);
  document.querySelector("#evaluationNextAction").textContent = next
    ? `다음 행동: ${profile.graduationEvaluation.checklist[Number(next.dataset.evaluation)].label}`
    : "모든 단계를 완료했습니다. 학과 최종 승인 여부를 확인하세요.";
  inputs.forEach((input) => {
    const card = document.querySelector(`[data-evaluation-card="${input.dataset.evaluation}"]`);
    card?.classList.toggle("completed", input.checked);
    const state = document.querySelector(`[data-evaluation-state="${input.dataset.evaluation}"]`);
    if (state) state.textContent = input.checked ? "완료된 단계" : "다음 확인이 필요한 단계";
  });
}

refreshEvaluationProgress();
document.querySelectorAll("[data-evaluation]").forEach((input) => input.addEventListener("change", refreshEvaluationProgress));

function activateTab(tabName, updateHash = false) {
  const button = document.querySelector(`[data-tab="${tabName}"]`);
  const panel = document.querySelector(`#tab-${tabName}`);
  if (!button || !panel) return;
  document.querySelectorAll("[data-tab]").forEach((item) => {
    item.classList.toggle("active", item === button);
    item.setAttribute("aria-selected", String(item === button));
  });
  document.querySelectorAll(".tab-panel").forEach((item) => {
    item.classList.add("hidden");
    item.setAttribute("aria-hidden", "true");
  });
  panel.classList.remove("hidden");
  panel.setAttribute("aria-hidden", "false");
  if (updateHash) history.replaceState(null, "", `#${tabName}`);
}

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tab, true));
});

activateTab(window.location.hash.slice(1) || "credits");

document.querySelectorAll(".editable-row input").forEach((input) => {
  input.addEventListener("input", () => {
    const row = input.closest(".editable-row");
    const completed = Number(row.querySelector('[data-field="completed"]').value);
    const required = Number(row.querySelector('[data-field="required"]').value);
    row.querySelector(".editable-status").innerHTML = statusBadge({
      completed,
      required,
      exception: Boolean(profile[row.dataset.itemId]?.exception),
    });
  });
});

document.querySelector("#saveRequirements").addEventListener("click", async () => {
  document.querySelectorAll(".editable-row").forEach((row) => {
    const id = row.dataset.itemId;
    if (!profile[id]) return;
    profile[id].completed = Number(row.querySelector('[data-field="completed"]').value);
    profile[id].required = Number(row.querySelector('[data-field="required"]').value);
  });

  profile.poom = profile.poom.map((item) => ({
    ...item,
    completed: document.querySelector(`[data-poom="${item.id}"]`).checked,
  }));
  profile.graduationEvaluation.checklist = profile.graduationEvaluation.checklist.map((item, index) => ({
    ...item,
    completed: document.querySelector(`[data-evaluation="${index}"]`).checked,
  }));
  profile.graduationEvaluation.completed = profile.graduationEvaluation.checklist.filter((item) => item.completed).length;
  profile.courses = profile.courses.map((course, index) => ({
    ...course,
    completed: document.querySelector(`[data-course="${index}"]`).checked,
  }));
  const saved = await saveProfile(profile);
  showToast(saved ? "졸업요건 입력값을 저장했습니다." : "클라우드 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
});
