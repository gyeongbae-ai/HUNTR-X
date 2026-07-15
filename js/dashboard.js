import { escapeHtml, initAppShell } from "./common.js";
import { calculateProgress, formatNumber, getActionItems, getCompletionRatio, getCreditGapSummary, getNextSemesterPlan, getPersonalizedStudyPlan, getRequirementItems, getStatus } from "./data.js";

const profile = initAppShell({ page: "dashboard", title: "진단 대시보드" });
if (!profile) throw new Error("Profile required");

const progress = calculateProgress(profile);
const requirements = getRequirementItems(profile);
const actionItems = getActionItems(profile);
const nextSemesterPlan = getNextSemesterPlan(profile);
const creditGapSummary = getCreditGapSummary(profile);
const studyPlan = getPersonalizedStudyPlan(profile);
const completedCount = requirements.filter((item) => getStatus(item) === "complete").length;
const warningCount = requirements.length - completedCount;

function renderRequirement(item) {
  const percent = Math.round(getCompletionRatio(item) * 100);
  const status = getStatus(item);
  const label = item.exception
    ? status === "complete" ? "학과 예외 충족" : "예외 과목 미충족"
    : status === "complete" ? "충족" : status === "warning" ? "보완 필요" : "부족";
  const badgeClass = item.exception && status === "complete" ? "info" : status === "complete" ? "success" : status;
  return `
    <article class="requirement-card">
      <div class="requirement-card-head">
        <strong>${escapeHtml(item.label)}</strong>
        <span class="badge badge-${badgeClass}">${label}</span>
      </div>
      <p>${escapeHtml(item.description)}</p>
      <div class="bar"><div class="bar-fill ${item.exception && status === "complete" ? "exception" : status}" style="width:${percent}%"></div></div>
      <div class="bar-meta"><span>${formatNumber(item.completed)}${item.suffix}</span><span>${formatNumber(item.required)}${item.suffix}</span></div>
    </article>`;
}

function getRatioPercent(value) {
  if (!value || !value.required) return 0;
  return Math.min(100, Math.round((value.completed / value.required) * 100));
}

function renderCreditMetric(label, value) {
  const percent = getRatioPercent(value);
  const statusClass = percent >= 100 ? "complete" : percent >= 70 ? "warning" : "danger";
  const remaining = Math.max(0, value.required - value.completed);
  return `
    <div class="metric metric-with-bar">
      <div class="metric-head">
        <span>${label}</span>
        <strong>${formatNumber(value.completed)}/${formatNumber(value.required)}</strong>
      </div>
      <div class="mini-progress" aria-label="${label} ${percent}% 충족">
        <div class="mini-progress-fill ${statusClass}" style="width:${percent}%"></div>
      </div>
      <div class="mini-progress-meta"><span>${percent}%</span><span>${formatNumber(remaining)}학점 남음</span></div>
    </div>`;
}

function renderPoomMetric(profile) {
  const completed = profile.poom.filter((item) => item.completed).length;
  const percent = Math.min(100, Math.round((completed / 3) * 100));
  return `
    <div class="metric metric-with-bar metric-poom">
      <div class="metric-head">
        <span>3품 인증</span>
        <strong>${completed}/3</strong>
      </div>
      <div class="mini-progress" aria-label="3품 인증 ${percent}% 충족">
        <div class="mini-progress-fill ${completed >= 3 ? "complete" : "warning"}" style="width:${percent}%"></div>
      </div>
      <div class="poom-icon-row" aria-label="3품 영역별 충족 현황">
        ${profile.poom
          .map(
            (item) => `
              <span class="poom-chip ${item.completed ? "completed" : ""}" title="${escapeHtml(item.label)} ${item.completed ? "충족" : "미충족"}">
                <span class="poom-chip-icon">${escapeHtml(item.label.slice(0, 1))}</span>
                <span>${escapeHtml(item.label)}</span>
              </span>`,
          )
          .join("")}
      </div>
    </div>`;
}

function renderGapMiniBar(item) {
  const percent = item.required ? Math.min(100, Math.round((item.completed / item.required) * 100)) : 0;
  const statusClass = percent >= 100 ? "complete" : percent >= 70 ? "warning" : "danger";
  return `
    <div class="mini-progress credit-gap-mini" aria-label="${escapeHtml(item.label)} ${percent}% 충족">
      <div class="mini-progress-fill ${statusClass}" style="width:${percent}%"></div>
    </div>`;
}

function renderCreditGapSection(section) {
  const visibleChildren = section.children.length ? section.children : [];
  const remainingLabel = section.remaining > 0 ? `${formatNumber(section.remaining)}학점 부족` : "충족";
  return `
    <article class="credit-gap-card ${section.remaining <= 0 ? "complete" : ""}">
      <div class="credit-gap-card-head">
        <div>
          <span>${escapeHtml(section.label)}</span>
          <strong>${formatNumber(section.completed)} / ${formatNumber(section.required)}학점</strong>
        </div>
        <em>${remainingLabel}</em>
      </div>
      ${renderGapMiniBar(section)}
      ${
        visibleChildren.length
          ? `<div class="credit-subgap-list">${visibleChildren
              .map(
                (item) => `
                  <div class="credit-subgap ${item.remaining <= 0 ? "complete" : ""}">
                    <span>${escapeHtml(item.label)}</span>
                    <strong>${formatNumber(item.completed)} / ${formatNumber(item.required)}학점</strong>
                    <em>${item.remaining > 0 ? `${formatNumber(item.remaining)}학점 남음` : "충족"}</em>
                  </div>`,
              )
              .join("")}</div>`
          : ""
      }
    </article>`;
}

function renderCreditGapSummary(summary) {
  const priorityGaps = summary.detailedGaps.slice(0, 4);
  return `
    <section class="credit-gap-panel">
      <div class="credit-gap-summary">
        <div>
          <p class="eyebrow">Credit gap map</p>
          <h3>어디를 더 채워야 하는지</h3>
          <p>${escapeHtml(summary.advice)}</p>
        </div>
        <div class="credit-gap-pills">
          ${priorityGaps.length ? priorityGaps.map((item) => `<span>${escapeHtml(item.label)} ${formatNumber(item.remaining)}학점</span>`).join("") : `<span>학점 기준 충족</span>`}
        </div>
      </div>
      <div class="credit-gap-grid">
        ${summary.sections
          .filter((section) => section.id === "totalCredits" || section.remaining > 0 || section.children.some((item) => item.remaining > 0))
          .map(renderCreditGapSection)
          .join("")}
      </div>
    </section>`;
}

function renderStudyPlan(plan) {
  return `
    <section class="panel study-plan-panel" style="margin-top:18px">
      <div class="panel-header">
        <div><p class="eyebrow">Personal roadmap</p><h2>다음에 채울 수업과 3품 활동</h2><p>현재 부족 영역과 전공 로드맵을 연결한 수강·활동 후보입니다.</p></div>
        <a class="btn btn-secondary" href="${plan.sourceUrl}" target="_blank" rel="noreferrer">전공 로드맵 확인</a>
      </div>
      <div class="roadmap-track" aria-label="개인 맞춤 졸업 로드맵">
        ${plan.roadmap.map((step, index) => `<article class="roadmap-step"><span>${String(index + 1).padStart(2, "0")} · ${escapeHtml(step.label)}</span><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.detail)}</p></article>`).join("")}
      </div>
      <div class="study-action-grid">
        <div class="study-action-column">
          <div class="study-action-heading"><div><h3>우선 수강 후보</h3><p>부족한 전공·교양 영역을 기준으로 최대 4개만 표시합니다.</p></div><span class="badge">${plan.courses.length}개</span></div>
          <div class="course-recommendation-list">
            ${plan.courses.map((course) => `<article class="course-recommendation-card"><div><span class="course-code">${escapeHtml(course.code)}</span><span class="badge badge-info">${escapeHtml(course.target)}</span></div><h4>${escapeHtml(course.name)}</h4><p>${escapeHtml(course.reason)}</p><footer><span>${course.credits}학점 · ${escapeHtml(course.semester)}</span><a class="text-link" href="${course.sourceUrl}" target="_blank" rel="noreferrer">교육과정 확인</a></footer></article>`).join("") || `<div class="alert alert-success">현재 입력값 기준으로 학점 영역이 충족되어 있습니다.</div>`}
          </div>
        </div>
        <div class="study-action-column poom-action-column">
          <div class="study-action-heading"><div><h3>3품 채우기</h3><p>미완료 영역 중 한 가지를 골라 실제 인정 조건을 확인하세요.</p></div><span class="badge badge-warning">${plan.poomActions.length}개 후보</span></div>
          <div class="poom-action-list">
            ${plan.poomActions.slice(0, 3).map((item) => `<article class="poom-action-card"><span class="poom-action-icon">${escapeHtml(item.area.slice(0, 1))}</span><div><strong>${escapeHtml(item.area)} · ${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p><a class="text-link" href="${item.href}" ${item.href.startsWith("http") ? `target="_blank" rel="noreferrer"` : ""}>활동 찾기</a></div></article>`).join("") || `<div class="alert alert-success">현재 입력값 기준으로 3품 인증 수가 충족되어 있습니다.</div>`}
          </div>
        </div>
      </div>
      <p class="study-plan-note">추천 과목은 교육과정 기반 후보입니다. 실제 개설 학기·선수과목·전공 인정은 GLS 수강편람과 학과 공지에서 최종 확인해야 합니다.</p>
    </section>`;
}

document.querySelector("#pageContent").innerHTML = `
  <div class="page-content">
    <div class="page-header">
      <div>
        <p class="eyebrow">Graduation overview</p>
        <h1>${escapeHtml(profile.name)}님의 졸업 여정</h1>
        <p>${escapeHtml(profile.admissionYear)}학번 · ${escapeHtml(profile.department)} · ${escapeHtml(profile.degreeTypeLabel)}</p>
      </div>
      <a class="btn btn-secondary" href="requirements.html">입력값 검토하기</a>
    </div>

    <div class="profile-strip">
      <div><strong>${escapeHtml(profile.department)}${profile.secondaryProgram !== "없음" ? ` + ${escapeHtml(profile.secondaryProgram)}` : ""}</strong><span>${escapeHtml(profile.campus)} · 현재 ${profile.currentSemester}학기 · GPA ${profile.gpa.toFixed(2)}</span></div>
      <span class="badge ${profile.earlyGraduation ? "badge-warning" : "badge-success"}">${profile.earlyGraduation ? "조기졸업 검토" : "일반졸업"}</span>
    </div>

    ${profile.dsEducation.exception ? `<div class="alert" style="margin-bottom:18px"><strong>${escapeHtml(profile.dsEducation.exceptionLabel)}</strong><br />일반 DS 과목 대신 ${escapeHtml(profile.dsEducation.detail)} 이수 여부로 판정했습니다.</div>` : ""}

    <div class="dashboard-grid">
      <section class="panel">
        <div class="summary-panel">
          <div class="progress-ring" style="--progress:${progress * 3.6}deg" aria-label="전체 진행률 ${progress}%">
            <div class="progress-ring-content"><strong>${progress}%</strong><span>전체 진행률</span></div>
          </div>
          <div class="summary-copy">
            <p class="eyebrow">Current status</p>
            <h2>${progress >= 85 ? "졸업이 가까워졌어요." : progress >= 65 ? "좋아요, 핵심 요건을 채우는 중이에요." : "지금부터 우선순위를 잡아볼게요."}</h2>
            <p>현재 입력값 기준 ${requirements.length}개 진단 항목 중 ${completedCount}개를 충족했습니다. 남은 항목은 중요도와 마감 시점을 함께 확인하세요.</p>
            <div class="badge-row">
              <span class="badge badge-success">충족 ${completedCount}</span>
              <span class="badge badge-warning">확인·보완 ${warningCount}</span>
              <span class="badge">업데이트 2026.07</span>
            </div>
          </div>
        </div>
        <div class="metric-grid">
          ${renderCreditMetric("총 졸업학점", profile.totalCredits)}
          ${renderCreditMetric("제1전공", profile.primaryMajor)}
          ${renderPoomMetric(profile)}
        </div>
        ${renderCreditGapSummary(creditGapSummary)}
      </section>

      <aside class="panel">
        <div class="panel-header"><div><h2>다음 행동</h2><p>부족한 요건 중 먼저 확인할 항목</p></div></div>
        <ul class="task-list">
          ${actionItems.length ? actionItems.map((item) => `<li class="task-item"><span class="task-dot"></span><div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span></div></li>`).join("") : `<li class="alert alert-success">모든 입력 항목이 충족 상태입니다.</li>`}
        </ul>
        <a class="btn btn-block" style="margin-top:16px" href="assistant.html">AI에게 계획 물어보기</a>
      </aside>
    </div>

    <section class="panel" style="margin-top:18px">
      <div class="panel-header">
        <div><h2>영역별 충족 현황</h2><p>수치를 누르면 상세 페이지에서 직접 수정할 수 있습니다.</p></div>
        <a class="text-link" href="requirements.html">전체 상세보기</a>
      </div>
      <div class="requirement-grid">${requirements.map(renderRequirement).join("")}</div>
    </section>

    <section class="panel" style="margin-top:18px">
      <div class="panel-header">
        <div><h2>다음 학기 추천 계획</h2><p>미이수 과목, 국제어수업, 3품, 졸업평가를 함께 고려한 우선순위입니다.</p></div>
        <a class="text-link" href="programs.html">비교과 추천 보기</a>
      </div>
      <div class="next-plan-grid">
        ${nextSemesterPlan
          .map(
            (item, index) => `
              <article class="plan-card">
                <span class="plan-index">${String(index + 1).padStart(2, "0")}</span>
                <div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></div>
                ${item.href ? `<a class="text-link" href="${item.href}">추천 보기</a>` : ""}
              </article>`,
          )
          .join("")}
      </div>
    </section>

    ${renderStudyPlan(studyPlan)}

    <div class="alert alert-warning" style="margin-top:18px">GradQuest는 조사자료 기반의 보조 진단 서비스입니다. 입학연도별 경과조치와 최신 학과 공지는 반드시 GLS 및 학과사무실에서 최종 확인하세요.</div>
  </div>`;
