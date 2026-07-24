import { getProfile, saveProfile } from "./auth.js";
import { escapeHtml, initAppShell, showToast } from "./common.js";
import {
  ensureEvidenceData,
  formatNumber,
  getRequirementItems,
  getStatus as getRequirementStatus,
  REQUIREMENT_OPTIONS,
  STORAGE_KEYS,
} from "./data.js";
import { getGlsExtractedText, mergeGlsCourses, parseGlsCourseDocument } from "./gls-course-parser.js";

const profile = initAppShell({ page: "evidence", title: "이수내역·문서 등록" });
if (!profile) throw new Error("Profile required");
ensureEvidenceData(profile);

const completedCourses = profile.courses.filter((course) => course.completed);
const recordedCredits = completedCourses.reduce((sum, course) => sum + Number(course.credits || 0), 0);
const requirementLabel = Object.fromEntries(REQUIREMENT_OPTIONS.map((item) => [item.id, item.label]));
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
  const status = getRequirementStatus(item);
  if (item.exception && status === "complete") return `<span class="badge badge-info">학과 예외 충족</span>`;
  const label = status === "complete" ? "충족" : status === "warning" ? "보완 필요" : "부족";
  return `<span class="badge badge-${status === "complete" ? "success" : status}">${label}</span>`;
}

function renderEditableRows() {
  return getRequirementItems(profile)
    .filter((item) => editableIds.has(item.id))
    .map((item) => `
      <div class="editable-row" data-item-id="${item.id}">
        <div class="editable-label"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.description)}</span></div>
        <input aria-label="${escapeHtml(item.label)} 현재 이수" type="number" min="0" step="1" value="${item.completed}" data-field="completed" />
        <span class="ratio-separator">/</span>
        <input aria-label="${escapeHtml(item.label)} 필요 기준" type="number" min="1" step="1" value="${item.required}" data-field="required" />
        <div class="editable-status">${statusBadge(item)}</div>
      </div>`).join("");
}

function renderPoomCards() {
  return profile.poom.map((item) => `
    <article class="poom-service-card ${item.completed ? "completed" : ""}" data-poom-card="${item.id}">
      <div class="poom-service-head">
        <span class="poom-service-icon">${escapeHtml(item.label.slice(0, 1))}</span>
        <label class="compact-check"><input type="checkbox" data-poom="${item.id}" ${item.completed ? "checked" : ""} /><span>인증 완료</span></label>
      </div>
      <h3>${escapeHtml(item.label)} 영역</h3>
      <p class="poom-service-state" data-poom-state="${item.id}">${item.completed ? "완료로 반영된 영역" : "아직 인증하지 않은 영역"}</p>
    </article>`).join("");
}

function renderEvaluationSteps() {
  return profile.graduationEvaluation.checklist.map((item, index) => `
    <article class="evaluation-step-card ${item.completed ? "completed" : ""}" data-evaluation-card="${index}">
      <div class="evaluation-step-number">${String(index + 1).padStart(2, "0")}</div>
      <div class="evaluation-step-copy"><strong>${escapeHtml(item.label)}</strong><span data-evaluation-state="${index}">${item.completed ? "완료한 단계" : "확인이 필요한 단계"}</span></div>
      <label class="compact-check"><input type="checkbox" data-evaluation="${index}" ${item.completed ? "checked" : ""} /><span>완료</span></label>
    </article>`).join("");
}

function courseSourceLabel(course) {
  return course.verified ? `${course.source} · 공식 대조` : course.source;
}

function renderCourseBadges(course) {
  return (course.badges || [])
    .map((badge) => `<span>${escapeHtml(badge)}</span>`)
    .join("");
}

function renderCourseRows() {
  return profile.courses
    .map(
      (course, index) => `
        <tr>
          <td><input type="checkbox" data-course="${index}" ${course.completed ? "checked" : ""} aria-label="${escapeHtml(course.name)} 이수" /></td>
          <td>${escapeHtml(course.term)}</td>
          <td><strong>${escapeHtml(course.code)}</strong></td>
          <td>${escapeHtml(course.name)}${course.badges?.length ? `<div class="course-badge-row">${renderCourseBadges(course)}</div>` : ""}</td>
          <td>${course.credits}</td>
          <td><span class="grade-chip">${escapeHtml(course.grade)}</span></td>
          <td><div class="requirement-chip-row">${course.requirementIds.map((id) => `<span>${escapeHtml(requirementLabel[id] || id)}</span>`).join("")}</div></td>
          <td>${escapeHtml(courseSourceLabel(course))}</td>
        </tr>`,
    )
    .join("");
}

function renderProgramCards() {
  if (!profile.nonCurricular.length) return `<div class="empty-evidence">아직 등록된 비교과 이수내역이 없습니다.</div>`;
  return profile.nonCurricular
    .map(
      (program) => `
        <article class="program-evidence-card">
          <div><span class="badge badge-success">${escapeHtml(program.status)}</span><span class="source-label">${escapeHtml(program.source)}</span></div>
          <h3>${escapeHtml(program.title)}</h3>
          <p>${escapeHtml(program.organizer)} · ${escapeHtml(program.completedAt)} · ${program.hours}시간</p>
          <div class="evidence-card-footer"><strong>${escapeHtml(program.certificationArea)} 인증</strong><span>3품 연결</span></div>
        </article>`,
    )
    .join("");
}

function renderImportRecords() {
  if (!profile.evidenceImports.length) {
    return `<div class="empty-evidence"><strong>등록된 문서가 없습니다.</strong><span>파일로 입력하기에서 GLS 또는 챌린지스퀘어 문서를 등록하세요.</span></div>`;
  }
  const labels = { gls: "GLS", challenge: "챌린지스퀘어", roadmap: "교과 로드맵" };
  return `<div class="import-record-list">${profile.evidenceImports.map((item) => `
    <article>
      <span class="source-symbol import-source-symbol ${item.type === "challenge" ? "long-label" : ""}">${escapeHtml(labels[item.type] || "DOC")}</span>
      <div><strong>${escapeHtml(item.label || "등록 문서")}</strong><span>${new Date(item.importedAt).toLocaleString("ko-KR")}</span></div>
      <span class="badge badge-success">반영 완료</span>
    </article>`).join("")}</div>`;
}

document.querySelector("#pageContent").innerHTML = `
  <div class="page-content evidence-record-page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Academic records</p>
        <h1>이수내역·문서 등록</h1>
        <p>졸업 진단에 반영할 모든 이수값을 수정하고, 성적표와 비교과 문서를 등록합니다.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-secondary" id="openEvidenceImport" type="button">파일로 입력하기</button>
        <button class="btn" id="saveEvidenceChanges" type="button">변경사항 저장</button>
      </div>
    </div>

    <div class="evidence-summary-grid">
      <div><span>이수 교과목</span><strong>${completedCourses.length}개</strong><small>성적까지 저장됨</small></div>
      <div><span>연결된 교과 학점</span><strong>${recordedCredits}학점</strong><small>현재 등록된 내역 기준</small></div>
      <div><span>비교과 이수</span><strong>${profile.nonCurricular.length}건</strong><small>챌린지스퀘어 내역</small></div>
      <div><span>문서 인식 기록</span><strong>${profile.evidenceImports.length}회</strong><small>GLS·챌린지스퀘어</small></div>
    </div>

    <section class="record-workspace">
      <div class="tabs record-tabs" role="tablist">
        <button class="tab-button active" type="button" data-record-tab="edit">요건 수치 수정</button>
        <button class="tab-button" type="button" data-record-tab="courses">교과목·성적</button>
        <button class="tab-button" type="button" data-record-tab="certifications">3품·졸업평가</button>
        <button class="tab-button" type="button" data-record-tab="programs">비교과 이수</button>
        <button class="tab-button" type="button" data-record-tab="imports">문서 등록 기록</button>
      </div>
      <section class="panel record-tab-panel" id="record-edit">
        <div class="panel-header"><div><h2>학점 및 교육과정 수치</h2><p>현재 이수값과 적용 기준을 수정하면 진단 대시보드에 바로 반영됩니다.</p></div><a class="text-link" href="dashboard.html">진단 결과 보기</a></div>
        <div class="editable-requirements">${renderEditableRows()}</div>
        <div class="alert alert-warning" style="margin-top:16px">필요 기준 수정은 데모 확인용입니다. 실제 졸업 판정은 입학연도별 공식 기준과 학과 공지를 우선합니다.</div>
      </section>
      <section class="panel record-tab-panel hidden" id="record-courses">
        <div class="panel-header"><div><h2>GLS 교과목·성적</h2><p>이수 여부를 수정하고 과목별 학점, 성적, 인정 요건을 확인합니다.</p></div><span class="badge">${completedCourses.length}과목 이수</span></div>
        <div class="evidence-table-wrap"><table class="course-table evidence-table"><thead><tr><th>이수</th><th>수강학기</th><th>학수번호</th><th>교과목명</th><th>학점</th><th>성적</th><th>인정 요건</th><th>출처</th></tr></thead><tbody>${renderCourseRows()}</tbody></table></div>
      </section>
      <section class="panel record-tab-panel hidden" id="record-certifications">
        <div class="panel-header"><div><h2>3품 인증 및 졸업평가</h2><p>챌린지스퀘어와 학과 공지에서 확인한 완료 상태를 반영합니다.</p></div><a class="text-link" href="programs.html">맞춤 비교과 찾기</a></div>
        <div class="record-subsection">
          <div class="record-subsection-title"><h3>3품 인증</h3><span class="badge" id="poomCount"></span></div>
          <div class="poom-service-grid">${renderPoomCards()}</div>
        </div>
        <div class="record-subsection">
          <div class="record-subsection-title"><div><h3>${escapeHtml(profile.graduationEvaluation.label)}</h3><p>${escapeHtml(profile.graduationEvaluation.description)}</p></div><span class="badge" id="evaluationCount"></span></div>
          <div class="evaluation-step-list">${renderEvaluationSteps()}</div>
        </div>
      </section>
      <section class="panel record-tab-panel hidden" id="record-programs">
        <div class="panel-header"><div><h2>챌린지스퀘어 비교과 이수</h2><p>최종 이수 상태와 인증영역을 확인합니다.</p></div><span class="badge">${profile.nonCurricular.length}건</span></div>
        <div class="program-evidence-grid">${renderProgramCards()}</div>
      </section>
      <section class="panel record-tab-panel hidden" id="record-imports">
        <div class="panel-header"><div><h2>문서 등록 기록</h2><p>계정에 반영된 파일 등록 기록입니다.</p></div><span class="badge">${profile.evidenceImports.length}회</span></div>
        ${renderImportRecords()}
      </section>
    </section>
  </div>`;

document.body.insertAdjacentHTML("beforeend", `
  <div class="evidence-import-modal hidden" id="evidenceImportModal" role="dialog" aria-modal="true" aria-labelledby="evidenceImportTitle">
    <button class="modal-backdrop" type="button" data-close-evidence-import aria-label="파일 입력 닫기"></button>
    <div class="evidence-import-dialog">
      <header>
        <div><p class="eyebrow">Import records</p><h2 id="evidenceImportTitle">파일로 이수내역 입력</h2><p>GLS와 챌린지스퀘어 파일을 선택해 내용을 확인합니다.</p></div>
        <button class="modal-close" type="button" data-close-evidence-import aria-label="닫기">×</button>
      </header>
      <div class="evidence-import-content">
        <div class="evidence-source-grid">
          <article class="evidence-source-card" data-document-type="gls">
            <div class="source-card-title"><span class="source-symbol">GLS</span><div><h3>학업성적표·이수내역</h3><p>교과목, 학수번호, 학점, 성적, 수강학기를 추출합니다.</p></div></div>
            <label class="evidence-upload-zone" for="glsFile" data-upload-type="gls"><strong>GLS 이수내역 파일 선택</strong><span>PDF 1개 또는 PNG·JPG 여러 장 · 클릭 또는 드래그 앤 드롭</span><input id="glsFile" type="file" accept="image/png,image/jpeg,application/pdf" multiple /></label>
            <div class="upload-preview hidden" id="glsPreview"></div>
            <div class="source-actions"><button class="btn" type="button" data-analyze="gls">파일 분석</button><button class="btn btn-secondary" type="button" data-sample="gls">샘플로 체험</button></div>
            <div class="alert hidden" id="glsStatus"></div>
          </article>
          <article class="evidence-source-card" data-document-type="challenge">
            <div class="source-card-title"><span class="source-symbol source-symbol-pink">CS</span><div><h3>챌린지스퀘어 비교과</h3><p>프로그램명, 이수일, 시간, 인증영역을 추출합니다.</p></div></div>
            <label class="evidence-upload-zone" for="challengeFile" data-upload-type="challenge"><strong>비교과 이수내역 파일 선택</strong><span>PDF 1개 또는 PNG·JPG 여러 장 · 클릭 또는 드래그 앤 드롭</span><input id="challengeFile" type="file" accept="image/png,image/jpeg,application/pdf" multiple /></label>
            <div class="upload-preview hidden" id="challengePreview"></div>
            <div class="source-actions"><button class="btn" type="button" data-analyze="challenge">파일 분석</button><button class="btn btn-secondary" type="button" data-sample="challenge">샘플로 체험</button></div>
            <div class="alert hidden" id="challengeStatus"></div>
          </article>
          <article class="evidence-source-card" data-document-type="roadmap">
            <div class="source-card-title"><span class="source-symbol source-symbol-blue">MAP</span><div><h3>교과 과정 로드맵</h3><p>학과별 권장 수강 순서를 참고자료로 첨부합니다.</p></div></div>
            <label class="evidence-upload-zone" for="roadmapFile" data-upload-type="roadmap"><strong>로드맵 파일 선택</strong><span>PNG, JPG, PDF · 전공 로드맵, 교육과정표, 학과 안내자료</span><input id="roadmapFile" type="file" accept="image/png,image/jpeg,application/pdf" /></label>
            <div class="upload-preview hidden" id="roadmapPreview"></div>
            <div class="source-actions"><button class="btn btn-secondary" type="button" data-sample="roadmap">참고자료로 등록</button></div>
            <div class="alert hidden" id="roadmapStatus"></div>
          </article>
        </div>
        <div class="recognition-flow" aria-label="문서 인식 과정">
          <div><strong>01</strong><span>파일 등록</span></div><i>→</i>
          <div><strong>02</strong><span>문서 인식</span></div><i>→</i>
          <div><strong>03</strong><span>사용자 검토</span></div><i>→</i>
          <div><strong>04</strong><span>요건 연결</span></div>
        </div>
        <div class="alert">개인정보가 포함된 문서는 본인 계정에서만 등록하고, 반영 전 인식 결과를 확인하세요.</div>
      </div>
    </div>
  </div>`);

function activateRecordTab(name, updateHash = false) {
  const button = document.querySelector(`[data-record-tab="${name}"]`);
  const panel = document.querySelector(`#record-${name}`);
  if (!button || !panel) return;
  document.querySelectorAll("[data-record-tab]").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".record-tab-panel").forEach((item) => item.classList.add("hidden"));
  panel.classList.remove("hidden");
  if (updateHash) history.replaceState(null, "", `#${name}`);
}

document.querySelectorAll("[data-record-tab]").forEach((button) => {
  button.addEventListener("click", () => activateRecordTab(button.dataset.recordTab, true));
});

const tabAliases = {
  credits: "edit",
  poom: "certifications",
  evaluation: "certifications",
  evidence: "courses",
};
activateRecordTab(tabAliases[window.location.hash.slice(1)] || window.location.hash.slice(1) || "edit");

function refreshEditableStatus(input) {
  const row = input.closest(".editable-row");
  const completed = Number(row.querySelector('[data-field="completed"]').value);
  const required = Number(row.querySelector('[data-field="required"]').value);
  row.querySelector(".editable-status").innerHTML = statusBadge({
    completed,
    required,
    exception: Boolean(profile[row.dataset.itemId]?.exception),
  });
}

document.querySelectorAll(".editable-row input").forEach((input) => {
  input.addEventListener("input", () => refreshEditableStatus(input));
});

function refreshCertificationState() {
  const poomInputs = [...document.querySelectorAll("[data-poom]")];
  const poomCount = poomInputs.filter((input) => input.checked).length;
  const poomBadge = document.querySelector("#poomCount");
  poomBadge.textContent = `${Math.min(poomCount, 3)}/3 인증`;
  poomBadge.className = `badge ${poomCount >= 3 ? "badge-success" : "badge-warning"}`;
  poomInputs.forEach((input) => {
    document.querySelector(`[data-poom-card="${input.dataset.poom}"]`)?.classList.toggle("completed", input.checked);
    const state = document.querySelector(`[data-poom-state="${input.dataset.poom}"]`);
    if (state) state.textContent = input.checked ? "완료로 반영된 영역" : "아직 인증하지 않은 영역";
  });

  const evaluationInputs = [...document.querySelectorAll("[data-evaluation]")];
  const evaluationCount = evaluationInputs.filter((input) => input.checked).length;
  const evaluationBadge = document.querySelector("#evaluationCount");
  evaluationBadge.textContent = `${evaluationCount}/${evaluationInputs.length} 단계`;
  evaluationBadge.className = `badge ${evaluationCount === evaluationInputs.length ? "badge-success" : "badge-warning"}`;
  evaluationInputs.forEach((input) => {
    document.querySelector(`[data-evaluation-card="${input.dataset.evaluation}"]`)?.classList.toggle("completed", input.checked);
    const state = document.querySelector(`[data-evaluation-state="${input.dataset.evaluation}"]`);
    if (state) state.textContent = input.checked ? "완료한 단계" : "확인이 필요한 단계";
  });
}

refreshCertificationState();
document.querySelectorAll("[data-poom], [data-evaluation]").forEach((input) => {
  input.addEventListener("change", refreshCertificationState);
});

document.querySelector("#saveEvidenceChanges")?.addEventListener("click", async () => {
  document.querySelectorAll(".editable-row").forEach((row) => {
    const target = profile[row.dataset.itemId];
    if (!target) return;
    target.completed = Number(row.querySelector('[data-field="completed"]').value);
    target.required = Number(row.querySelector('[data-field="required"]').value);
  });
  profile.courses = profile.courses.map((course, index) => ({
    ...course,
    completed: Boolean(document.querySelector(`[data-course="${index}"]`)?.checked),
  }));
  profile.poom = profile.poom.map((item) => ({
    ...item,
    completed: Boolean(document.querySelector(`[data-poom="${item.id}"]`)?.checked),
  }));
  profile.graduationEvaluation.checklist = profile.graduationEvaluation.checklist.map((item, index) => ({
    ...item,
    completed: Boolean(document.querySelector(`[data-evaluation="${index}"]`)?.checked),
  }));
  profile.graduationEvaluation.completed = profile.graduationEvaluation.checklist.filter((item) => item.completed).length;
  const saved = await saveProfile(profile);
  showToast(saved ? "이수정보와 졸업요건 수정 내용을 저장했습니다." : "저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
});

const importModal = document.querySelector("#evidenceImportModal");
const closeImportModal = () => {
  importModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  document.querySelector("#openEvidenceImport")?.focus();
};
document.querySelector("#openEvidenceImport")?.addEventListener("click", () => {
  importModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  importModal.querySelector(".modal-close")?.focus();
});
document.querySelectorAll("[data-close-evidence-import]").forEach((button) => button.addEventListener("click", closeImportModal));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !importModal.classList.contains("hidden")) closeImportModal();
});

function getInput(type) {
  if (type === "gls") return document.querySelector("#glsFile");
  if (type === "challenge") return document.querySelector("#challengeFile");
  return document.querySelector("#roadmapFile");
}

function getStatus(type) {
  if (type === "gls") return document.querySelector("#glsStatus");
  if (type === "challenge") return document.querySelector("#challengeStatus");
  return document.querySelector("#roadmapStatus");
}

function getPreview(type) {
  if (type === "gls") return document.querySelector("#glsPreview");
  if (type === "challenge") return document.querySelector("#challengePreview");
  return document.querySelector("#roadmapPreview");
}

async function makePreview(file) {
  if (!file?.type.startsWith("image/")) return null;
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const image = await new Promise((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = dataUrl;
  });
  const scale = Math.min(1, 900 / image.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.72);
}

function extractParsedText(payload) {
  const candidates = [payload?.content?.text, payload?.content?.html, payload?.text, payload?.html, payload?.result?.text, payload?.result?.html].filter(Boolean);
  const elements = Array.isArray(payload?.elements)
    ? payload.elements.map((item) => item?.content?.text || item?.content?.html || item?.text || "").filter(Boolean)
    : [];
  const normalizeChunk = (value) => {
    if (!/<[a-z][\s\S]*>/i.test(value)) return value;
    const documentNode = new DOMParser().parseFromString(value, "text/html");
    const tableRows = [...documentNode.querySelectorAll("tr")]
      .map((row) => [...row.querySelectorAll("th, td")].map((cell) => cell.textContent.trim()).filter(Boolean).join(" | "))
      .filter(Boolean);
    return tableRows.length ? tableRows.join("\n") : documentNode.body.textContent;
  };
  return [...candidates, ...elements]
    .map(normalizeChunk)
    .join("\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 30000);
}

function createSample(type) {
  if (type === "roadmap") {
    return {
      extractedItems: [],
      extractedText: "소프트웨어학과 교과 과정 로드맵 참고자료\n전공코어 → 전공심화 → 캡스톤 → 졸업평가 순서로 이수 여부를 대조합니다.",
    };
  }
  if (type === "gls") {
    const courses = profile.courses.filter((course) => course.completed).slice(0, 7);
    return {
      extractedItems: courses,
      extractedText: ["성균관대학교 GLS 학업성적표", "수강학기 | 학수번호 | 교과목명 | 학점 | 성적", ...courses.map((course) => `${course.term} | ${course.code} | ${course.name} | ${course.credits} | ${course.grade}`)].join("\n"),
    };
  }
  const programs = profile.nonCurricular.length
    ? profile.nonCurricular
    : [{ id: "CS-SAMPLE-AI", title: "AI 기초역량 온라인 과정", organizer: "교육개발센터", completedAt: "2026-06-20", hours: 10, status: "이수", certificationArea: "AI", requirementIds: ["poom"], source: "챌린지스퀘어 샘플" }];
  return {
    extractedItems: programs,
    extractedText: ["챌린지스퀘어 비교과 이수내역", "프로그램명 | 운영기관 | 이수일 | 시간 | 인증영역", ...programs.map((program) => `${program.title} | ${program.organizer} | ${program.completedAt} | ${program.hours} | ${program.certificationArea}`)].join("\n"),
  };
}

function saveDraft(type, details) {
  localStorage.setItem(STORAGE_KEYS.parsedDocument, JSON.stringify({
    documentType: type,
    profileDraft: getProfile(),
    parsedAt: new Date().toISOString(),
    ...details,
  }));
  window.location.assign("transcript-review.html");
}

document.querySelectorAll("[data-sample]").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.sample;
    if (type === "roadmap") {
      const status = getStatus("roadmap");
      status.textContent = "교과 과정 로드맵 참고자료가 등록되었습니다. 졸업요건 판정 시 학과별 권장 이수 흐름을 함께 확인할 수 있습니다.";
      status.className = "alert alert-success";
      return;
    }
    saveDraft(type, { fileName: type === "gls" ? "GLS_학업성적표_샘플.png" : type === "challenge" ? "챌린지스퀘어_이수내역_샘플.png" : "교과과정_로드맵_샘플.pdf", provider: "Document Parse 샘플", ...createSample(type) });
  });
});

async function setSelectedFiles(type, files) {
  const selected = [...files].filter((file) => file?.type.startsWith("image/") || file?.type === "application/pdf");
  if (!selected.length) return;
  const input = getInput(type);
  const preview = getPreview(type);
  const status = getStatus(type);
  if (selected.length > 1 && selected.some((file) => file.type === "application/pdf")) {
    status.textContent = "PDF는 한 번에 한 파일만 선택해 주세요. 여러 장은 PNG 또는 JPG로 선택할 수 있습니다.";
    status.className = "alert alert-warning";
    return;
  }
  const transfer = new DataTransfer();
  selected.forEach((file) => transfer.items.add(file));
  input.files = transfer.files;
  const firstFile = selected[0];
  const dataUrl = await makePreview(firstFile).catch(() => null);
  preview.classList.remove("hidden");
  const fileLabel = selected.length === 1 ? firstFile.name : `${firstFile.name} 외 ${selected.length - 1}개`;
  preview.innerHTML = dataUrl ? `<img src="${dataUrl}" alt="선택한 파일 미리보기" /><span>${escapeHtml(fileLabel)}</span>` : `<strong>PDF</strong><span>${escapeHtml(fileLabel)}</span>`;
  preview.dataset.preview = dataUrl || "";
  status.textContent = selected.length === 1 ? `${firstFile.name} 파일을 불러왔습니다.` : `${selected.length}개 파일을 순서대로 인식합니다.`;
  status.className = "alert alert-success";
}

document.querySelectorAll("input[type=file]").forEach((input) => {
  input.addEventListener("change", async () => {
    const type = input.id === "glsFile" ? "gls" : input.id === "challengeFile" ? "challenge" : "roadmap";
    await setSelectedFiles(type, input.files);
  });
});

let activeUploadType = "gls";

document.querySelectorAll("[data-upload-type]").forEach((zone) => {
  const type = zone.dataset.uploadType;
  zone.addEventListener("pointerenter", () => {
    activeUploadType = type;
  });
  zone.addEventListener("focusin", () => {
    activeUploadType = type;
  });
  zone.addEventListener("click", () => {
    activeUploadType = type;
  });
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    activeUploadType = type;
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", async (event) => {
    event.preventDefault();
    zone.classList.remove("drag-over");
    await setSelectedFiles(type, event.dataTransfer.files);
  });
});

document.addEventListener("paste", async (event) => {
  const file = [...event.clipboardData.files].find((item) => item.type.startsWith("image/") || item.type === "application/pdf");
  if (!file) return;
  const activeType = document.activeElement?.closest?.("[data-upload-type]")?.dataset.uploadType || activeUploadType;
  await setSelectedFiles(activeType, [...getInput(activeType).files, file]);
});

document.querySelectorAll("[data-analyze]").forEach((button) => {
  button.addEventListener("click", async () => {
    const type = button.dataset.analyze;
    if (type === "roadmap") return;
    const input = getInput(type);
    const status = getStatus(type);
    const files = [...input.files];
    if (!files.length) {
      status.textContent = "먼저 인식할 파일을 선택해 주세요.";
      status.className = "alert alert-warning";
      return;
    }
    status.textContent = `${files.length}개 파일에서 표 구조를 분석하고 있습니다...`;
    status.className = "alert";
    const payloads = [];
    const failedFiles = [];
    try {
      for (const [index, file] of files.entries()) {
        status.textContent = `${index + 1}/${files.length}번째 파일에서 표 구조를 분석하고 있습니다...`;
        const body = new FormData();
        body.append("document", file);
        body.append("model", "document-parse");
        body.append("ocr", "force");
        body.append("base64_encoding", "['table']");
        const response = await fetch("/api/parse", { method: "POST", body });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          failedFiles.push(file.name);
          continue;
        }
        payloads.push({ file, payload });
      }
      if (!payloads.length) throw new Error("No documents could be parsed");
      const extractedItems = type === "gls" ? mergeGlsCourses(payloads.map(({ payload }) => parseGlsCourseDocument(payload))) : undefined;
      const extractedText = payloads
        .map(({ file, payload }) => `=== ${file.name} ===\n${type === "gls" ? getGlsExtractedText(payload) : extractParsedText(payload)}`)
        .join("\n\n");
      saveDraft(type, {
        fileName: files.length === 1 ? files[0].name : `${files[0].name} 외 ${files.length - 1}개`,
        fileNames: files.map((file) => file.name),
        provider: "Upstage Document Parse",
        extractedText,
        extractedItems,
        parseWarnings: failedFiles.length ? `${failedFiles.length}개 파일은 인식하지 못했습니다.` : "",
        previewDataUrl: document.querySelector(type === "gls" ? "#glsPreview" : "#challengePreview").dataset.preview || "",
      });
    } catch {
      const sample = createSample(type);
      saveDraft(type, { fileName: files.length === 1 ? files[0].name : `${files[0].name} 외 ${files.length - 1}개`, provider: "수동 검토 모드", previewDataUrl: document.querySelector(type === "gls" ? "#glsPreview" : "#challengePreview").dataset.preview || "", ...sample });
    }
  });
});
