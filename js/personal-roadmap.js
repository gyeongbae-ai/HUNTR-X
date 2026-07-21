import { saveProfile } from "./auth.js";
import { escapeHtml, initAppShell, showToast } from "./common.js";
import {
  createWhatIfAssumptions,
  formatNumber,
  getAvailableWhatIfPresets,
  getNextSemesterPlan,
  getPersonalizedStudyPlan,
  simulateWhatIfCombination,
} from "./data.js";

const profile = initAppShell({ page: "roadmap", title: "개인 로드맵" });
if (!profile) throw new Error("Profile required");

const nextPlan = getNextSemesterPlan(profile);
const studyPlan = getPersonalizedStudyPlan(profile);
const whatIfPresets = getAvailableWhatIfPresets(profile);

function makePlan(name = "새 시뮬레이션") {
  return {
    id: `WHAT_IF_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    assumptions: createWhatIfAssumptions(),
    updatedAt: new Date().toISOString(),
  };
}

function ensureWhatIfWorkspace() {
  const saved = profile.whatIfWorkspace;
  if (saved?.plans?.length) {
    saved.plans = saved.plans.map((plan, index) => ({
      id: plan.id || `WHAT_IF_SAVED_${index}`,
      name: plan.name || `시뮬레이션 ${index + 1}`,
      assumptions: { ...createWhatIfAssumptions(), ...(plan.assumptions || {}) },
      updatedAt: plan.updatedAt || new Date().toISOString(),
    }));
    if (!saved.plans.some((plan) => plan.id === saved.activePlanId)) saved.activePlanId = saved.plans[0].id;
    return saved;
  }
  const first = makePlan("나의 첫 시뮬레이션");
  profile.whatIfWorkspace = { activePlanId: first.id, plans: [first] };
  return profile.whatIfWorkspace;
}

const whatIfWorkspace = ensureWhatIfWorkspace();
let saveTimer;

function getActiveWhatIfPlan() {
  return whatIfWorkspace.plans.find((plan) => plan.id === whatIfWorkspace.activePlanId) || whatIfWorkspace.plans[0];
}

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

function renderWhatIfResult(assumptions) {
  const result = simulateWhatIfCombination(profile, assumptions);
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
    </div>
    ${result.cautions.length ? `<div class="what-if-cautions"><strong>확인 필요</strong>${result.cautions.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>` : ""}`;
}

const whatIfNumberFields = [
  ["extraLeaveSemesters", "추가 휴학", "학기", 8],
  ["extraElectiveCredits", "기타·자유선택", "학점", 60],
  ["extraPrimaryCredits", "제1전공", "학점", 60],
  ["extraSecondaryCredits", "제2전공·트랙", "학점", 60],
  ["extraGeneralCredits", "교양", "학점", 60],
  ["extraDsCredits", "DS 교육", "학점", 20],
  ["extraInternationalCredits", "국제어 전체", "학점", 60],
  ["extraInternationalMajorCredits", "전공 국제어", "학점", 60],
  ["extraPoomCount", "3품 인증", "개", 5],
  ["extraEvaluationSteps", "졸업평가", "단계", 20],
  ["addedProgramRequired", "추가 과정 요구", "학점", 60],
  ["addedProgramCompleted", "추가 과정 선이수", "학점", 60],
];

function renderWhatIfWorkspace() {
  const activePlan = getActiveWhatIfPlan();
  const assumptions = activePlan.assumptions;
  const categories = [...new Set(whatIfPresets.map((preset) => preset.category))];
  const selected = new Set(assumptions.selectedPresets || []);
  document.querySelector("#whatIfPanel").innerHTML = `
    <div class="panel-header what-if-builder-head">
      <div><p class="eyebrow">What-if workspace</p><h2>만약에 시뮬레이션</h2><p>여러 선택지를 조합하고 수치를 직접 조정해 비교하세요. 저장한 계획은 현재 로그인 계정에서 다시 볼 수 있습니다.</p></div>
      <span class="badge badge-info" id="whatIfSaveState">계정별 저장</span>
    </div>

    <div class="what-if-plan-toolbar">
      <label><span>저장된 계획</span><select id="whatIfPlanSelect">${whatIfWorkspace.plans.map((plan) => `<option value="${escapeHtml(plan.id)}" ${plan.id === activePlan.id ? "selected" : ""}>${escapeHtml(plan.name)}</option>`).join("")}</select></label>
      <label class="what-if-plan-name"><span>계획 이름</span><input id="whatIfPlanName" value="${escapeHtml(activePlan.name)}" maxlength="40" /></label>
      <button class="btn btn-secondary" id="newWhatIfPlan" type="button">새 계획</button>
      <button class="btn" id="saveWhatIfPlan" type="button">저장</button>
      <button class="btn btn-danger" id="deleteWhatIfPlan" type="button" ${whatIfWorkspace.plans.length === 1 ? "disabled" : ""}>삭제</button>
    </div>

    <div class="what-if-builder-layout">
      <div class="what-if-builder-controls">
        <div class="what-if-preset-groups">
          ${categories.map((category) => `
            <section class="what-if-preset-group">
              <div><strong>${escapeHtml(category)}</strong><span>중복 선택 가능</span></div>
              <div class="what-if-preset-grid">
                ${whatIfPresets.filter((preset) => preset.category === category).map((preset) => `
                  <button class="what-if-preset ${selected.has(preset.id) ? "active" : ""}" data-preset="${preset.id}" data-conflict="${preset.conflict || ""}" type="button" aria-pressed="${selected.has(preset.id)}">
                    <span class="what-if-check" aria-hidden="true">${selected.has(preset.id) ? "✓" : "+"}</span>
                    <strong>${escapeHtml(preset.label)}</strong>
                    <small>${escapeHtml(preset.description)}</small>
                  </button>`).join("")}
              </div>
            </section>`).join("")}
        </div>

        <details class="what-if-manual" ${whatIfNumberFields.some(([key]) => Number(assumptions[key])) || assumptions.note ? "open" : ""}>
          <summary>직접 수치 조정</summary>
          <p>버튼의 기본 가정에 더해 추가로 반영할 수치만 입력하세요. 국제어 인정학점은 총 취득학점에 중복 합산하지 않습니다.</p>
          <div class="what-if-field-grid">
            ${whatIfNumberFields.map(([key, label, suffix, max]) => `
              <label class="what-if-number-field"><span>${escapeHtml(label)}</span><span><input type="number" min="0" max="${max}" step="1" value="${Number(assumptions[key] || 0)}" data-assumption="${key}" /><i>${suffix}</i></span></label>`).join("")}
          </div>
          <label class="what-if-note-field"><span>내 가정 메모</span><textarea data-assumption="note" rows="2" maxlength="240" placeholder="예: 교환학점은 전공 3학점 인정으로 학과에 사전 문의 예정">${escapeHtml(assumptions.note || "")}</textarea></label>
        </details>
      </div>
      <aside class="what-if-output" id="whatIfOutput">${renderWhatIfResult(assumptions)}</aside>
    </div>
    <p class="what-if-notice">시뮬레이션은 선택지 탐색용입니다. 복수전공 선발, 교환·현장실습 학점인정, 조기졸업과 각 과정의 신청 가능 여부는 GLS와 담당 부서 공지를 확인하세요.</p>`;
  bindWhatIfEvents();
}

function updateActivePlan(mutator) {
  const plan = getActiveWhatIfPlan();
  mutator(plan);
  plan.updatedAt = new Date().toISOString();
  scheduleWhatIfSave();
}

function scheduleWhatIfSave() {
  window.clearTimeout(saveTimer);
  const state = document.querySelector("#whatIfSaveState");
  if (state) state.textContent = "저장 대기";
  saveTimer = window.setTimeout(() => persistWhatIfWorkspace(false), 900);
}

async function persistWhatIfWorkspace(notify = true) {
  window.clearTimeout(saveTimer);
  profile.whatIfWorkspace = whatIfWorkspace;
  const state = document.querySelector("#whatIfSaveState");
  if (state) state.textContent = "저장 중";
  const saved = await saveProfile(profile);
  if (state) state.textContent = saved ? "저장됨" : "저장 실패";
  if (notify) showToast(saved ? "What-If 계획을 계정에 저장했습니다." : "저장하지 못했습니다. 네트워크 상태를 확인해 주세요.");
  return saved;
}

function bindWhatIfEvents() {
  document.querySelector("#whatIfPlanSelect").addEventListener("change", (event) => {
    whatIfWorkspace.activePlanId = event.target.value;
    renderWhatIfWorkspace();
    scheduleWhatIfSave();
  });
  document.querySelector("#whatIfPlanName").addEventListener("input", (event) => {
    updateActivePlan((plan) => { plan.name = event.target.value.trimStart() || "이름 없는 계획"; });
    document.querySelector("#whatIfPlanSelect").selectedOptions[0].textContent = event.target.value || "이름 없는 계획";
  });
  document.querySelector("#newWhatIfPlan").addEventListener("click", () => {
    const plan = makePlan(`시뮬레이션 ${whatIfWorkspace.plans.length + 1}`);
    whatIfWorkspace.plans.push(plan);
    whatIfWorkspace.activePlanId = plan.id;
    renderWhatIfWorkspace();
    scheduleWhatIfSave();
  });
  document.querySelector("#deleteWhatIfPlan").addEventListener("click", () => {
    if (whatIfWorkspace.plans.length <= 1) return;
    const index = whatIfWorkspace.plans.findIndex((plan) => plan.id === whatIfWorkspace.activePlanId);
    whatIfWorkspace.plans.splice(index, 1);
    whatIfWorkspace.activePlanId = whatIfWorkspace.plans[Math.max(0, index - 1)].id;
    renderWhatIfWorkspace();
    scheduleWhatIfSave();
  });
  document.querySelector("#saveWhatIfPlan").addEventListener("click", () => persistWhatIfWorkspace(true));

  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      updateActivePlan((plan) => {
        const values = new Set(plan.assumptions.selectedPresets || []);
        if (values.has(button.dataset.preset)) {
          values.delete(button.dataset.preset);
        } else {
          if (button.dataset.conflict) {
            whatIfPresets.filter((item) => item.conflict === button.dataset.conflict).forEach((item) => values.delete(item.id));
          }
          values.add(button.dataset.preset);
        }
        plan.assumptions.selectedPresets = [...values];
      });
      renderWhatIfWorkspace();
    });
  });

  document.querySelectorAll("[data-assumption]").forEach((input) => {
    const eventName = input.tagName === "TEXTAREA" ? "input" : "change";
    input.addEventListener(eventName, () => {
      updateActivePlan((plan) => {
        plan.assumptions[input.dataset.assumption] = input.type === "number" ? Math.max(0, Number(input.value) || 0) : input.value;
      });
      document.querySelector("#whatIfOutput").innerHTML = renderWhatIfResult(getActiveWhatIfPlan().assumptions);
    });
  });
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

    <section class="panel what-if-panel" id="whatIfPanel"></section>

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

renderWhatIfWorkspace();
activateRoadmapTab(window.location.hash.slice(1) || "courses");
