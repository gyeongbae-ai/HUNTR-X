import { escapeHtml, initAppShell } from "./common.js";
import {
  formatNumber,
  getNextSemesterPlan,
  getPersonalizedStudyPlan,
  getWhatIfScenarios,
  simulateWhatIf,
} from "./data.js";

const profile = initAppShell({ page: "roadmap", title: "개인 로드맵" });
if (!profile) throw new Error("Profile required");

const nextPlan = getNextSemesterPlan(profile);
const studyPlan = getPersonalizedStudyPlan(profile);
const whatIfScenarios = getWhatIfScenarios(profile);

function renderPlanItem(item, index) {
  return `
    <article class="semester-plan-item">
      <span class="plan-index">${String(index + 1).padStart(2, "0")}</span>
      <div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></div>
      ${item.href ? `<a class="text-link" href="${item.href}">확인</a>` : ""}
    </article>`;
}

function renderCourseCandidates() {
  if (!studyPlan.courses.length) {
    return `<div class="empty-roadmap"><strong>우선 추천할 미이수 과목이 없습니다.</strong><span>수강편람에서 전공선택 과목의 실제 개설 여부를 확인하세요.</span></div>`;
  }
  return `<div class="course-candidate-list">${studyPlan.courses.map((course) => `
    <article class="course-candidate">
      <div><span class="course-code">${escapeHtml(course.code)}</span><span class="badge badge-info">${escapeHtml(course.target)}</span></div>
      <h3>${escapeHtml(course.name)}</h3>
      <p>${escapeHtml(course.reason)}</p>
      <footer><span>${formatNumber(course.credits)}학점 · ${escapeHtml(course.semester)}</span><a class="text-link" href="${course.sourceUrl}" target="_blank" rel="noreferrer">교육과정</a></footer>
    </article>`).join("")}</div>`;
}

function renderPoomActivities() {
  const actions = studyPlan.poomActions;
  return `
    <div class="roadmap-poom-overview">
      ${profile.poom.map((item) => `<div class="roadmap-poom ${item.completed ? "completed" : ""}"><span>${escapeHtml(item.label.slice(0, 1))}</span><strong>${escapeHtml(item.label)}</strong><small>${item.completed ? "완료" : "미완료"}</small></div>`).join("")}
    </div>
    <div class="poom-action-list">
      ${actions.length ? actions.map((item) => `
        <article class="poom-action-card">
          <span class="poom-action-icon">${escapeHtml(item.area.slice(0, 1))}</span>
          <div><strong>${escapeHtml(item.area)} · ${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p><a class="text-link" href="${item.href}" ${item.href.startsWith("http") ? `target="_blank" rel="noreferrer"` : ""}>활동 확인</a></div>
        </article>`).join("") : `<div class="empty-roadmap"><strong>현재 3품 인증 수를 충족했습니다.</strong><span>최종 인정 상태는 챌린지스퀘어에서 확인하세요.</span></div>`}
    </div>`;
}

function renderEvaluation() {
  const evaluation = profile.graduationEvaluation;
  return `
    <div class="evaluation-roadmap-head">
      <div><span>학과 특수 졸업요건</span><h3>${escapeHtml(evaluation.label)}</h3><p>${escapeHtml(evaluation.description)}</p></div>
      <strong>${evaluation.completed}/${evaluation.required}단계</strong>
    </div>
    <div class="evaluation-roadmap-list">
      ${evaluation.checklist.map((item, index) => `
        <div class="${item.completed ? "completed" : ""}">
          <span>${item.completed ? "✓" : String(index + 1).padStart(2, "0")}</span>
          <strong>${escapeHtml(item.label)}</strong>
          <small>${item.completed ? "완료" : "계획 필요"}</small>
        </div>`).join("")}
    </div>
    <a class="btn btn-secondary" href="evidence.html#certifications">졸업평가 상태 수정</a>`;
}

function renderWhatIfResult(scenarioId) {
  const result = simulateWhatIf(profile, scenarioId);
  const delta = result.after.progress - result.before.progress;
  return `
    <div class="what-if-result-head">
      <div><span>Simulation result</span><h3>${escapeHtml(result.headline)}</h3><p>${escapeHtml(result.explanation)}</p></div>
      <strong class="${delta > 0 ? "positive" : delta < 0 ? "negative" : ""}">${delta > 0 ? "+" : ""}${delta}%p</strong>
    </div>
    <div class="what-if-comparison">
      <article>
        <span>현재 계획</span>
        <strong>${result.before.progress}%</strong>
        <p>미충족 ${result.before.pending}개 · ${escapeHtml(result.before.graduation)}</p>
      </article>
      <i aria-hidden="true">→</i>
      <article class="after">
        <span>가정 적용</span>
        <strong>${result.after.progress}%</strong>
        <p>미충족 ${result.after.pending}개 · ${escapeHtml(result.after.graduation)}</p>
      </article>
    </div>
    <div class="what-if-changes">
      ${result.changes.map((change) => `<span>${escapeHtml(change)}</span>`).join("")}
    </div>`;
}

document.querySelector("#pageContent").innerHTML = `
  <div class="page-content roadmap-page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Personal roadmap</p>
        <h1>${escapeHtml(profile.name)}님의 개인 로드맵</h1>
        <p>현재 진단 결과를 바탕으로 다음 학기와 졸업 전 계획을 정리했습니다.</p>
      </div>
      <a class="btn btn-secondary" href="dashboard.html">진단 현황 보기</a>
    </div>

    <a class="ai-roadmap-bar" href="assistant.html">
      <span class="ai-roadmap-mark">AI</span>
      <div><strong>내 상황을 AI에게 물어보기</strong><span>부족한 요건과 다음 수강 순서를 이어서 상담하세요.</span></div>
      <i aria-hidden="true">→</i>
    </a>

    <section class="panel what-if-panel">
      <div class="panel-header">
        <div><p class="eyebrow">What-if</p><h2>만약에 시뮬레이션</h2><p>선택을 저장하지 않고 졸업계획에 미치는 영향만 비교합니다.</p></div>
        <span class="badge badge-info">현재 데이터 유지</span>
      </div>
      <div class="what-if-layout">
        <div class="what-if-options" role="tablist" aria-label="가정 시나리오">
          ${whatIfScenarios.map((scenario, index) => `
            <button class="${index === 0 ? "active" : ""}" type="button" data-what-if="${scenario.id}" role="tab" aria-selected="${index === 0}">
              <strong>${escapeHtml(scenario.label)}</strong>
              <span>${escapeHtml(scenario.description)}</span>
            </button>`).join("")}
        </div>
        <div class="what-if-output" id="whatIfOutput">${renderWhatIfResult(whatIfScenarios[0].id)}</div>
      </div>
      <p class="what-if-notice">시뮬레이션은 선택지 탐색용입니다. 실제 졸업 판정과 신청 가능 여부는 GLS와 학과 공지를 확인하세요.</p>
    </section>

    <section class="panel roadmap-semester-panel">
      <div class="panel-header"><div><p class="eyebrow">Next semester</p><h2>다음 학기 추천 계획</h2><p>마감과 준비 순서를 고려한 우선 항목입니다.</p></div><a class="text-link" href="academic-calendar.html">학사 일정</a></div>
      <div class="semester-plan-list">${nextPlan.length ? nextPlan.map(renderPlanItem).join("") : `<div class="empty-roadmap"><strong>현재 입력된 항목은 모두 충족 상태입니다.</strong><span>다음 학기 개설 과목과 학과 공지를 확인하세요.</span></div>`}</div>
    </section>

    <section class="roadmap-detail-section">
      <div class="panel-header"><div><p class="eyebrow">Detailed roadmap</p><h2>상세 로드맵</h2><p>확인할 영역을 선택하세요.</p></div></div>
      <div class="roadmap-track" aria-label="개인 맞춤 졸업 로드맵">
        ${studyPlan.roadmap.map((step, index) => `<article class="roadmap-step"><span>${String(index + 1).padStart(2, "0")} · ${escapeHtml(step.label)}</span><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.detail)}</p></article>`).join("")}
      </div>
      <div class="tabs roadmap-tabs" role="tablist">
        <button class="tab-button active" type="button" data-roadmap-tab="courses">우선 수강 후보</button>
        <button class="tab-button" type="button" data-roadmap-tab="poom">3품 활동</button>
        <button class="tab-button" type="button" data-roadmap-tab="evaluation">학과 졸업요건</button>
      </div>
      <section class="panel roadmap-tab-panel" id="roadmap-courses">
        <div class="roadmap-tab-head"><div><h2>우선 수강 후보</h2><p>부족 영역과 전공 교육과정을 연결한 후보입니다.</p></div><a class="btn btn-secondary" href="${studyPlan.sourceUrl}" target="_blank" rel="noreferrer">전공 로드맵 확인</a></div>
        ${renderCourseCandidates()}
      </section>
      <section class="panel roadmap-tab-panel hidden" id="roadmap-poom">${renderPoomActivities()}</section>
      <section class="panel roadmap-tab-panel hidden" id="roadmap-evaluation">${renderEvaluation()}</section>
    </section>
  </div>`;

function activateRoadmapTab(name, updateHash = false) {
  const button = document.querySelector(`[data-roadmap-tab="${name}"]`);
  const panel = document.querySelector(`#roadmap-${name}`);
  if (!button || !panel) return;
  document.querySelectorAll("[data-roadmap-tab]").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".roadmap-tab-panel").forEach((item) => item.classList.add("hidden"));
  panel.classList.remove("hidden");
  if (updateHash) history.replaceState(null, "", `#${name}`);
}

document.querySelectorAll("[data-roadmap-tab]").forEach((button) => {
  button.addEventListener("click", () => activateRoadmapTab(button.dataset.roadmapTab, true));
});

document.querySelectorAll("[data-what-if]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-what-if]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    document.querySelector("#whatIfOutput").innerHTML = renderWhatIfResult(button.dataset.whatIf);
  });
});

activateRoadmapTab(window.location.hash.slice(1) || "courses");
