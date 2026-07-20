import { saveProfile } from "./auth.js";
import { escapeHtml, initAppShell, showToast } from "./common.js";

const profile = initAppShell({ page: "programs", title: "맞춤 비교과 추천" });
if (!profile) throw new Error("Profile required");

const PROGRAMS = [
  {
    id: "aice-associate",
    title: "KT AICE Associate 자격증 취득 과정",
    category: "ai",
    categoryLabel: "AI 역량",
    hours: 10,
    format: "온라인 비교과",
    period: "vacation",
    periodLabel: "방학 중",
    grades: [2, 3, 4],
    note: "AI 기초 역량과 자격 인증을 함께 준비하기 좋은 과정입니다.",
    url: "https://www.skku.edu/skku/campus/skk_comm/notice07.do?articleNo=137828&mode=view",
  },
  {
    id: "adsp-bootcamp",
    title: "3시간 만에 합격하는 ADsP",
    category: "ai",
    categoryLabel: "AI 역량",
    hours: 5,
    format: "온라인",
    period: "vacation",
    periodLabel: "방학 중",
    grades: [1, 2, 3],
    note: "데이터 분석 입문과 시험 대비를 짧게 연결할 수 있는 후보입니다.",
    url: "https://eng.skku.edu/skku/campus/skk_comm/notice07.do?articleNo=138192&mode=view",
  },
  {
    id: "machine-learning-basic",
    title: "데이터 활용 머신러닝과 알고리즘 기초 특강",
    category: "ai",
    categoryLabel: "AI 역량",
    hours: 10,
    format: "온라인 비교과",
    period: "semester",
    periodLabel: "학기 중",
    grades: [2, 3],
    note: "전공과 상관없이 AI 활용 역량을 보완하기 좋은 기초 과정입니다.",
    url: "https://www.skku.edu/skku/campus/skk_comm/notice07.do?articleNo=137827&mode=view",
  },
  {
    id: "share-via-ai",
    title: "성균공부방 Share via AI",
    category: "creativity",
    categoryLabel: "창의 역량",
    hours: 6,
    format: "온오프라인",
    period: "semester",
    periodLabel: "학기 중",
    grades: [1, 2, 3, 4],
    note: "AI를 활용한 문제 해결과 공유 활동으로 창의 영역을 채우는 데 어울립니다.",
    url: "https://www.skku.edu/skku/campus/skk_comm/notice01.do?mode=view&articleNo=137324&article.offset=0&articleLimit=10&srSearchVal=%EC%84%B1%EA%B7%A0%EA%B3%B5%EB%B6%80%EB%B0%A9",
  },
  {
    id: "bridge-builder",
    title: "BRIDGE Builder 글로벌 프로젝트",
    category: "global",
    categoryLabel: "글로벌 역량",
    hours: null,
    format: "팀 프로젝트",
    period: "semester",
    periodLabel: "학기 중",
    grades: [2, 3],
    note: "해외 교류, 협업, 프로젝트 경험을 계획으로 묶기 좋은 글로벌 활동입니다.",
    url: "https://www.skku.edu/skku/campus/skk_comm/notice07.do?mode=view&articleNo=138050",
  },
  {
    id: "global-colloquium",
    title: "SKKU Global Colloquium",
    category: "global",
    categoryLabel: "글로벌 역량",
    hours: null,
    format: "오프라인",
    period: "semester",
    periodLabel: "학기 중",
    grades: [1, 2, 3, 4],
    note: "강연 참여형 글로벌 역량 활동으로 일정 확인 후 선택하기 좋습니다.",
    url: "https://www.skku.edu/skku/campus/skk_comm/notice07.do?mode=view&articleNo=138380&article.offset=0&articleLimit=10&srSearchVal=SKKU+Global+Colloquium",
  },
  {
    id: "co-op-field",
    title: "현장실습 Co-op 프로그램",
    category: "internship",
    categoryLabel: "실무 역량",
    hours: null,
    format: "현장실습",
    period: "vacation",
    periodLabel: "방학 중",
    grades: [3, 4],
    note: "전공과 연결되는 실무 경험을 졸업 계획 안에 배치하기 좋습니다.",
    url: "https://tollgate.skku.edu/",
  },
];

const STATUS_LABELS = {
  planned: "계획",
  applied: "신청",
  active: "참여 중",
  done: "완료",
};

const STATUS_ORDER = ["planned", "applied", "active", "done"];
const PERIOD_LABELS = {
  semester: "학기 중",
  vacation: "방학 중",
  both: "상시",
};
const GRADE_ROADMAP = [
  {
    grade: 1,
    title: "탐색과 기본기",
    detail: "관심 역량을 넓히고 짧은 특강, 콜로키움, 기초 AI 활동을 먼저 담아보세요.",
  },
  {
    grade: 2,
    title: "역량 선택",
    detail: "AI, 글로벌, 창의 중 부족한 3품 영역을 정하고 학기 중 활동을 꾸준히 배치합니다.",
  },
  {
    grade: 3,
    title: "경험 확장",
    detail: "팀 프로젝트, 공모전, 현장실습처럼 증빙이 남는 활동을 방학과 연결해 준비합니다.",
  },
  {
    grade: 4,
    title: "마감과 증빙",
    detail: "신청 상태, 수료증, 인정 시간, Challenge Square 반영 여부를 마지막으로 확인합니다.",
  },
];
const pendingCategories = new Set((profile.poom || []).filter((item) => !item.completed).map((item) => item.id));
const completedCount = (profile.poom || []).filter((item) => item.completed).length;
let editingPlanId = null;

const rankedPrograms = PROGRAMS.map((program) => ({
  ...program,
  matchScore:
    (pendingCategories.has(program.category) ? 70 : 25) +
    (program.hours ? 15 : 0) +
    (program.format.includes("온라인") ? 10 : 0),
  matched: pendingCategories.has(program.category),
})).sort((a, b) => b.matchScore - a.matchScore);

function getPlans() {
  return Array.isArray(profile.programPlans) ? profile.programPlans : [];
}

function setPlans(plans) {
  profile.programPlans = plans;
}

function getProgramById(id) {
  return PROGRAMS.find((program) => program.id === id);
}

function getSelectedProgramTitle(formData) {
  const programId = String(formData.get("programId") || "");
  const customTitle = String(formData.get("customTitle") || "").trim();
  return customTitle || getProgramById(programId)?.title || "";
}

function getPlanStats(plans) {
  return {
    total: plans.length,
    done: plans.filter((plan) => plan.status === "done").length,
    active: plans.filter((plan) => plan.status === "applied" || plan.status === "active").length,
    semester: plans.filter((plan) => plan.period === "semester").length,
    vacation: plans.filter((plan) => plan.period === "vacation").length,
  };
}

function renderProgramOptions(selectedId = "") {
  return rankedPrograms
    .map((program) => `<option value="${program.id}" ${program.id === selectedId ? "selected" : ""}>${escapeHtml(program.title)}</option>`)
    .join("");
}

function renderProgram(program) {
  return `
    <article class="program-card program-card-enhanced" data-category="${program.category}" data-period="${program.period}" data-matched="${program.matched}" draggable="true" data-program-id="${program.id}">
      <div class="program-card-head">
        <span class="badge ${program.matched ? "badge-success" : ""}">${program.matched ? "맞춤 추천" : escapeHtml(program.categoryLabel)}</span>
        <strong class="match-score">${program.matchScore}점</strong>
      </div>
      <h2>${escapeHtml(program.title)}</h2>
      <div class="program-meta">
        <span>${escapeHtml(program.format)}</span>
        <span>${escapeHtml(program.periodLabel)}</span>
        <span>${program.grades.map((grade) => `${grade}학년`).join(" · ")}</span>
        <span>${program.hours ? `인정 후보 ${program.hours}시간` : "인정 여부 확인 필요"}</span>
      </div>
      <p>${escapeHtml(program.note)}</p>
      <div class="program-card-actions">
        <button class="btn btn-block" type="button" data-add-plan="${program.id}">계획에 담기</button>
        <a class="btn btn-secondary btn-block" href="${program.url}" target="_blank" rel="noreferrer">공식 안내</a>
      </div>
    </article>`;
}

function renderPlan(plan, index) {
  const status = plan.status || "planned";
  const program = getProgramById(plan.programId);
  const sourceUrl = plan.url || program?.url;
  return `
    <article class="saved-plan-card" data-plan-id="${escapeHtml(plan.id)}">
      <div class="saved-plan-top">
        <span class="plan-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="badge badge-${status === "done" ? "success" : status === "planned" ? "warning" : "info"}">${STATUS_LABELS[status] || "계획"}</span>
      </div>
      <h3>${escapeHtml(plan.title)}</h3>
      <dl class="plan-workbook-fields">
        <div><dt>역량</dt><dd>${escapeHtml(plan.competency || program?.categoryLabel || "미정")}</dd></div>
        <div><dt>추천 학년</dt><dd>${plan.grade ? `${escapeHtml(plan.grade)}학년` : "미정"}</dd></div>
        <div><dt>운영 시기</dt><dd>${escapeHtml(PERIOD_LABELS[plan.period] || program?.periodLabel || "미정")}</dd></div>
        <div><dt>희망 시기</dt><dd>${escapeHtml(plan.term || "미정")}</dd></div>
        <div><dt>선택 이유</dt><dd>${escapeHtml(plan.reason || "아직 작성하지 않았습니다.")}</dd></div>
      </dl>
      ${plan.memo ? `<p class="saved-plan-memo">${escapeHtml(plan.memo)}</p>` : ""}
      <div class="saved-plan-actions">
        <button class="btn btn-secondary btn-ghost" type="button" data-edit-plan="${escapeHtml(plan.id)}">수정</button>
        <button class="btn btn-secondary btn-ghost" type="button" data-next-status="${escapeHtml(plan.id)}">상태 변경</button>
        <button class="btn btn-danger btn-ghost" type="button" data-delete-plan="${escapeHtml(plan.id)}">삭제</button>
        ${sourceUrl ? `<a class="text-link" href="${sourceUrl}" target="_blank" rel="noreferrer">공식 안내</a>` : ""}
      </div>
    </article>`;
}

function renderSavedPlans() {
  const plans = getPlans();
  const container = document.querySelector("#savedPlans");
  const stats = getPlanStats(plans);
  document.querySelector("#planTotal").textContent = `${stats.total}개`;
  document.querySelector("#planActive").textContent = `${stats.active}개`;
  document.querySelector("#planDone").textContent = `${stats.done}개`;
  document.querySelector("#planSemester").textContent = `${stats.semester}개`;
  document.querySelector("#planVacation").textContent = `${stats.vacation}개`;
  container.innerHTML = plans.length
    ? plans.map(renderPlan).join("")
    : `<div class="empty-plan-state">
        <strong>아직 저장된 비교과 계획이 없습니다.</strong>
        <p>추천 카드의 “계획에 담기”를 누르거나 직접 프로그램명, 역량, 선택 이유를 적어보세요.</p>
      </div>`;
  bindPlanActions();
}

function getRoadmapStatus(plan) {
  return plan.status === "done" ? "완료" : "계획";
}

function renderGradeRoadmapStep(item, plans) {
  const gradePlans = plans.filter((plan) => String(plan.grade) === String(item.grade));
  const doneCount = gradePlans.filter((plan) => plan.status === "done").length;
  const plannedCount = gradePlans.length - doneCount;
  return `
    <article class="grade-roadmap-card">
      <div class="grade-node" aria-hidden="true">${item.grade}</div>
      <div class="grade-roadmap-copy">
        <span>${item.grade}학년</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.detail)}</p>
        <div class="roadmap-counts">
          <strong>계획 ${plannedCount}</strong>
          <strong class="done">완료 ${doneCount}</strong>
        </div>
      </div>
      <div class="roadmap-plan-list">
        ${
          gradePlans.length
            ? gradePlans
                .map(
                  (plan) => `
                    <span class="roadmap-plan-pill ${plan.status === "done" ? "done" : "planned"}">
                      <em>${getRoadmapStatus(plan)}</em>
                      ${escapeHtml(plan.title)}
                    </span>`,
                )
                .join("")
            : `<span class="roadmap-empty">아직 저장한 계획이 없습니다.</span>`
        }
      </div>
    </article>`;
}

function resetForm() {
  editingPlanId = null;
  const form = document.querySelector("#programPlanForm");
  form.reset();
  document.querySelector("#planProgram").value = rankedPrograms[0]?.id || "";
  document.querySelector("#customTitle").value = "";
  document.querySelector("#competency").value = getProgramById(document.querySelector("#planProgram").value)?.categoryLabel || "";
  document.querySelector("#grade").value = "";
  document.querySelector("#period").value = getProgramById(document.querySelector("#planProgram").value)?.period || "semester";
  document.querySelector("#formModeLabel").textContent = "새 계획";
  document.querySelector("#savePlanButton").textContent = "내 계획 저장";
}

function fillFormFromProgram(programId) {
  const program = getProgramById(programId);
  if (!program) return;
  editingPlanId = null;
  document.querySelector("#planProgram").value = program.id;
  document.querySelector("#customTitle").value = "";
  document.querySelector("#competency").value = program.categoryLabel;
  document.querySelector("#grade").value = String(program.grades[0] || "");
  document.querySelector("#period").value = program.period;
  document.querySelector("#term").value = "";
  document.querySelector("#status").value = "planned";
  document.querySelector("#reason").value = program.matched
    ? `${program.categoryLabel} 보완이 필요해서 우선 신청 후보로 저장합니다.`
    : "관심 분야와 연결되는 비교과 활동으로 검토합니다.";
  document.querySelector("#memo").value = program.note;
  document.querySelector("#formModeLabel").textContent = "추천에서 담기";
  document.querySelector("#savePlanButton").textContent = "내 계획 저장";
  document.querySelector("#programPlanner").scrollIntoView({ behavior: "smooth", block: "start" });
}

function fillFormFromPlan(planId) {
  const plan = getPlans().find((item) => item.id === planId);
  if (!plan) return;
  editingPlanId = plan.id;
  document.querySelector("#planProgram").value = plan.programId || rankedPrograms[0]?.id || "";
  document.querySelector("#customTitle").value = getProgramById(plan.programId)?.title === plan.title ? "" : plan.title;
  document.querySelector("#competency").value = plan.competency || getProgramById(plan.programId)?.categoryLabel || "";
  document.querySelector("#grade").value = String(plan.grade || "");
  document.querySelector("#period").value = plan.period || getProgramById(plan.programId)?.period || "semester";
  document.querySelector("#term").value = plan.term || "";
  document.querySelector("#status").value = plan.status || "planned";
  document.querySelector("#reason").value = plan.reason || "";
  document.querySelector("#memo").value = plan.memo || "";
  document.querySelector("#formModeLabel").textContent = "계획 수정";
  document.querySelector("#savePlanButton").textContent = "수정 저장";
  document.querySelector("#programPlanner").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function persistPlans(plans, successMessage) {
  setPlans(plans);
  const saved = await saveProfile(profile);
  if (!saved) {
    showToast("클라우드 저장에 실패했습니다. 네트워크를 확인한 뒤 다시 시도해 주세요.");
    return false;
  }
  renderSavedPlans();
  showToast(successMessage);
  return true;
}

function getNextStatus(status) {
  const currentIndex = STATUS_ORDER.indexOf(status || "planned");
  return STATUS_ORDER[(currentIndex + 1) % STATUS_ORDER.length];
}

function bindPlanActions() {
  document.querySelectorAll("[data-edit-plan]").forEach((button) => {
    button.addEventListener("click", () => fillFormFromPlan(button.dataset.editPlan));
  });
  document.querySelectorAll("[data-next-status]").forEach((button) => {
    button.addEventListener("click", async () => {
      const plans = getPlans().map((plan) =>
        plan.id === button.dataset.nextStatus
          ? { ...plan, status: getNextStatus(plan.status), updatedAt: new Date().toISOString() }
          : plan,
      );
      await persistPlans(plans, "계획 상태를 바꿨습니다.");
    });
  });
  document.querySelectorAll("[data-delete-plan]").forEach((button) => {
    button.addEventListener("click", async () => {
      const plan = getPlans().find((item) => item.id === button.dataset.deletePlan);
      if (!plan || !window.confirm(`"${plan.title}" 계획을 삭제할까요?`)) return;
      await persistPlans(getPlans().filter((item) => item.id !== plan.id), "계획을 삭제했습니다.");
      if (editingPlanId === plan.id) resetForm();
    });
  });
}

function bindPageActions() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      document.querySelectorAll(".program-card").forEach((card) => {
        const visible =
          filter === "all" ||
          card.dataset.category === filter ||
          (filter === "matched" && card.dataset.matched === "true");
        card.classList.toggle("hidden", !visible);
      });
    });
  });

  document.querySelectorAll("[data-period-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-period-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.periodFilter;
      document.querySelectorAll(".program-card").forEach((card) => {
        card.classList.toggle("period-hidden", filter !== "all" && card.dataset.period !== filter);
      });
    });
  });

  document.querySelectorAll("[data-add-plan]").forEach((button) => {
    button.addEventListener("click", () => fillFormFromProgram(button.dataset.addPlan));
  });

  document.querySelectorAll(".program-card[draggable='true']").forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", card.dataset.programId);
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
  });

  const dropZone = document.querySelector("#planDropZone");
  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("drag-over");
  });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("drag-over");
    const programId = event.dataTransfer.getData("text/plain");
    if (getProgramById(programId)) fillFormFromProgram(programId);
  });

  document.querySelector("#planProgram").addEventListener("change", (event) => {
    const program = getProgramById(event.target.value);
    if (program && !document.querySelector("#competency").value) {
      document.querySelector("#competency").value = program.categoryLabel;
    }
    if (program) {
      document.querySelector("#period").value = program.period;
      document.querySelector("#grade").value = String(program.grades[0] || "");
    }
  });

  document.querySelector("#resetPlanButton").addEventListener("click", resetForm);

  document.querySelector("#programPlanForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const programId = String(formData.get("programId") || "");
    const program = getProgramById(programId);
    const title = getSelectedProgramTitle(formData);
    if (!title) {
      showToast("프로그램명을 입력해 주세요.");
      return;
    }

    const now = new Date().toISOString();
    const draft = {
      id: editingPlanId || `plan_${Date.now()}`,
      programId,
      title,
      category: program?.category || "custom",
      competency: String(formData.get("competency") || program?.categoryLabel || "").trim(),
      grade: String(formData.get("grade") || "").trim(),
      period: String(formData.get("period") || program?.period || "semester"),
      term: String(formData.get("term") || "").trim(),
      status: String(formData.get("status") || "planned"),
      reason: String(formData.get("reason") || "").trim(),
      memo: String(formData.get("memo") || "").trim(),
      url: program?.url || "",
      createdAt: getPlans().find((plan) => plan.id === editingPlanId)?.createdAt || now,
      updatedAt: now,
    };

    const nextPlans = editingPlanId
      ? getPlans().map((plan) => (plan.id === editingPlanId ? draft : plan))
      : [draft, ...getPlans()];
    const saved = await persistPlans(nextPlans, editingPlanId ? "비교과 계획을 수정했습니다." : "비교과 계획을 저장했습니다.");
    if (saved) resetForm();
  });
}

function renderPage() {
  const plans = getPlans();
  const stats = getPlanStats(plans);
  const pendingLabels = (profile.poom || []).filter((item) => !item.completed).map((item) => item.label);

  document.querySelector("#pageContent").innerHTML = `
    <div class="page-content programs-page">
      <section class="program-hero">
        <div class="program-hero-copy">
          <p class="eyebrow">Opportunity workbook</p>
          <h1>${escapeHtml(profile.name)}님의 비교과 추천과 개인 계획</h1>
          <p>학년별 로드맵에 내가 세운 계획과 완료한 비교과를 함께 표시합니다. 프로그램명·역량·선택 이유를 저장하면 현재 로그인한 계정의 프로필에 묶여 보관됩니다.</p>
          <div class="program-hero-stats">
            <span><strong>${completedCount}/3</strong>3품 충족</span>
            <span><strong>${stats.total}</strong>내 계획</span>
            <span><strong>${stats.done}</strong>완료</span>
          </div>
        </div>
      </section>

      <div class="profile-strip">
        <div>
          <strong>${escapeHtml(profile.name)}님의 3품 현황</strong>
          <span>${pendingLabels.length ? `아직 채울 영역: ${pendingLabels.join(" · ")}` : "현재 입력 기준으로 3품 요건을 충족했습니다."}</span>
        </div>
        <span class="badge ${completedCount >= 3 ? "badge-success" : "badge-warning"}">${completedCount >= 3 ? "졸업 기준 충족" : `${3 - completedCount}개 더 필요`}</span>
      </div>

      <section class="planner-summary-band" aria-label="저장된 비교과 계획 요약">
        <div><span>저장된 계획</span><strong id="planTotal">${stats.total}개</strong></div>
        <div><span>신청·참여 중</span><strong id="planActive">${stats.active}개</strong></div>
        <div><span>완료</span><strong id="planDone">${stats.done}개</strong></div>
        <div><span>학기 중</span><strong id="planSemester">${stats.semester}개</strong></div>
        <div><span>방학 중</span><strong id="planVacation">${stats.vacation}개</strong></div>
      </section>

      <section class="grade-roadmap-section" aria-labelledby="gradeRoadmapTitle">
        <div class="program-section-head">
          <div>
            <p class="eyebrow">Grade roadmap</p>
            <h2 id="gradeRoadmapTitle">학년별 비교과 계획 세우기</h2>
            <p>학년이 올라갈수록 탐색에서 증빙 관리로 무게중심을 옮기도록 구성했습니다.</p>
          </div>
        </div>
        <div class="grade-roadmap-track">
          ${GRADE_ROADMAP.map((item) => renderGradeRoadmapStep(item, plans)).join("")}
        </div>
      </section>

      <section class="programs-recommendation-section">
        <div class="program-section-head">
          <div>
            <p class="eyebrow">Recommended programs</p>
            <h2>부족한 역량에 맞춘 비교과 추천</h2>
            <p>점수는 미완료 3품 영역, 인정 후보 시간, 온라인 참여 가능성을 단순 반영한 MVP 기준입니다.</p>
          </div>
          <a class="btn btn-secondary" href="evidence.html#certifications">3품 현황 수정</a>
        </div>

        <div class="program-toolbar" role="group" aria-label="프로그램 필터">
          <button class="filter-chip active" type="button" data-filter="all">전체</button>
          <button class="filter-chip" type="button" data-filter="matched">나에게 필요한 역량</button>
          <button class="filter-chip" type="button" data-filter="ai">AI</button>
          <button class="filter-chip" type="button" data-filter="creativity">창의</button>
          <button class="filter-chip" type="button" data-filter="global">글로벌</button>
          <button class="filter-chip" type="button" data-filter="internship">실무</button>
        </div>

        <div class="program-period-tabs" role="group" aria-label="운영 시기 필터">
          <button class="period-tab active" type="button" data-period-filter="all">전체 일정</button>
          <button class="period-tab" type="button" data-period-filter="semester">학기 중 개최</button>
          <button class="period-tab" type="button" data-period-filter="vacation">방학 중 개최</button>
        </div>

        <div class="program-grid" id="programGrid">
          ${rankedPrograms.map(renderProgram).join("")}
        </div>
      </section>

      <section class="program-planner-layout" id="programPlanner">
        <form class="program-plan-form" id="programPlanForm">
          <div class="panel-header">
            <div>
              <p class="eyebrow">My workbook</p>
              <h2>내 비교과 계획 세우기</h2>
              <p>카드를 끌어다 놓거나 버튼으로 담은 뒤 프로그램명, 역량, 선택 이유를 저장합니다.</p>
            </div>
            <span class="badge badge-info" id="formModeLabel">새 계획</span>
          </div>

          <div class="plan-drop-zone" id="planDropZone">
            <strong>추천 카드를 여기로 드래그</strong>
            <span>프로그램명과 운영 시기가 자동으로 채워집니다.</span>
          </div>

          <div class="workbook-form-grid">
            <div class="field form-span-2">
              <label for="planProgram">추천 프로그램</label>
              <select id="planProgram" name="programId">${renderProgramOptions(rankedPrograms[0]?.id)}</select>
            </div>
            <div class="field form-span-2">
              <label for="customTitle">직접 입력 프로그램명</label>
              <input id="customTitle" name="customTitle" placeholder="추천 목록에 없으면 여기에 적어주세요." />
            </div>
            <div class="field">
              <label for="competency">역량</label>
              <input id="competency" name="competency" placeholder="예: AI 역량, 글로벌 역량" />
            </div>
            <div class="field">
              <label for="grade">추천 학년</label>
              <select id="grade" name="grade">
                <option value="">학년 선택</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
                <option value="4">4학년</option>
              </select>
            </div>
            <div class="field">
              <label for="period">운영 시기</label>
              <select id="period" name="period">
                <option value="semester">학기 중</option>
                <option value="vacation">방학 중</option>
                <option value="both">상시</option>
              </select>
            </div>
            <div class="field">
              <label for="term">희망 시기</label>
              <input id="term" name="term" placeholder="예: 2026-2학기, 방학 중" />
            </div>
            <div class="field">
              <label for="status">진행상태</label>
              <select id="status" name="status">
                ${STATUS_ORDER.map((status) => `<option value="${status}">${STATUS_LABELS[status]}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label for="reason">선택 이유</label>
              <textarea id="reason" name="reason" placeholder="이 프로그램을 고른 이유를 적어주세요."></textarea>
            </div>
            <div class="field form-span-2">
              <label for="memo">메모</label>
              <textarea id="memo" name="memo" placeholder="신청 링크 확인, 증빙 업로드, 인정 시간 확인 등"></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-secondary" type="button" id="resetPlanButton">새로 작성</button>
            <button class="btn" type="submit" id="savePlanButton">내 계획 저장</button>
          </div>
        </form>

        <section class="saved-plans-panel" aria-labelledby="savedPlansTitle">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Saved plans</p>
              <h2 id="savedPlansTitle">로그인별 저장된 계획</h2>
              <p>같은 브라우저에서도 계정이 바뀌면 각자 저장한 계획만 불러옵니다.</p>
            </div>
          </div>
          <div class="saved-plans-list" id="savedPlans"></div>
        </section>
      </section>

      <section class="more-programs-panel" aria-labelledby="moreProgramsTitle">
        <div>
          <p class="eyebrow">More opportunities</p>
          <h2 id="moreProgramsTitle">더 많은 비교과 찾아보기</h2>
          <p>실제 인정 시간과 신청 가능 여부는 학기마다 달라질 수 있으니 공식 안내 페이지에서 마지막으로 확인하세요.</p>
        </div>
        <div class="more-program-links">
          <a href="https://skkustusuccess.notion.site/" target="_blank" rel="noreferrer">
            <strong>SKKU 비교과 가이드</strong>
            <span>비교과 프로그램과 학생성공 활동 안내</span>
          </a>
          <a href="https://tollgate.skku.edu/" target="_blank" rel="noreferrer">
            <strong>현장실습지원센터 Co-op</strong>
            <span>인턴십, 현장실습 신청과 공지 확인</span>
          </a>
          <a href="https://job.skku.edu/Main/" target="_blank" rel="noreferrer">
            <strong>학생인재개발팀 커리어센터</strong>
            <span>진로 상담, 채용 정보, 취업 프로그램 확인</span>
          </a>
        </div>
      </section>

      <div class="alert alert-warning" style="margin-top:18px">추천 점수와 계획 저장은 졸업 준비를 돕는 보조 기능입니다. 실제 3품 인정, 비교과 이수 시간, 신청 가능 여부는 Challenge Square와 공식 공지에서 최종 확인해 주세요.</div>
    </div>`;

  bindPageActions();
  renderSavedPlans();
  resetForm();
}

renderPage();
