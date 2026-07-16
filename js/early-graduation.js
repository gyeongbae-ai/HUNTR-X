import { saveProfile } from "./auth.js";
import { escapeHtml, initAppShell, showToast } from "./common.js";
import { calculateProgress, formatNumber } from "./data.js";

const profile = initAppShell({ page: "early", title: "조기졸업 진단" });
if (!profile) throw new Error("Profile required");

const dsExceptionNotice = profile.dsEducation.exception
  ? `<div class="alert" style="margin-bottom:18px"><strong>${escapeHtml(profile.dsEducation.exceptionLabel)}</strong><br />${escapeHtml(profile.dsEducation.detail)} 6학점을 일반 DS 과목 대신 적용합니다.</div>`
  : "";
const researchTimeline = profile.graduationEvaluation.timeline
  ? `<div class="timeline-strip">${profile.graduationEvaluation.timeline.map((item) => `<div><span>${item.semester}학기</span><strong>${escapeHtml(item.label)}</strong></div>`).join("")}</div>`
  : "";

document.querySelector("#pageContent").innerHTML = `
  <div class="page-content">
    <div class="page-header">
      <div>
        <p class="eyebrow">Early graduation</p>
        <h1>조기졸업 가능성 진단</h1>
        <p>현재 등록학기, GPA, 총학점과 전체 졸업요건 진행률을 기준으로 부족분을 계산합니다.</p>
      </div>
    </div>

    <div class="alert alert-warning" style="margin-bottom:18px">일반 조기졸업 데모 기준은 6~7학기, GPA 4.00 이상으로 설정했습니다. 학부-대학원 연계과정은 3.50 등 별도 규정이 적용될 수 있으니 구분해서 확인하세요.</div>
    ${dsExceptionNotice}

    <div class="early-grid">
      <section class="panel">
        <div class="panel-header"><div><h2>현재 조건 입력</h2><p>값을 바꾸면 오른쪽 판정이 즉시 갱신됩니다.</p></div></div>
        <form id="earlyForm" class="form-grid">
          <div class="field form-span-2">
            <label for="semester">현재 등록학기</label>
            <input id="semester" type="number" min="1" max="10" value="${profile.currentSemester}" />
          </div>
          <div class="field">
            <label for="gpa">총평점</label>
            <input id="gpa" type="number" min="0" max="4.5" step="0.01" value="${profile.gpa}" />
          </div>
          <div class="field">
            <label for="credits">취득학점</label>
            <input id="credits" type="number" min="0" value="${profile.totalCredits.completed}" />
          </div>
          <div class="field form-span-2">
            <label for="requirementsProgress">전체 요건 진행률</label>
            <input id="requirementsProgress" type="number" min="0" max="100" value="${calculateProgress(profile)}" />
            <span class="field-hint">전공·교양·3품·졸업평가를 종합한 현재 데모 진행률입니다.</span>
          </div>
        </form>
        <button class="btn btn-block" id="saveEarly" style="margin-top:18px" type="button">현재 값 저장</button>
      </section>

      <section class="panel">
        <div class="panel-header"><div><h2 id="resultTitle">판정 결과</h2><p id="resultDescription"></p></div><span id="resultBadge"></span></div>
        <div class="criteria-list" id="criteriaList"></div>
        <div class="alert" id="resultCallout" style="margin-top:18px"></div>
      </section>
    </div>

    <section class="panel" style="margin-top:18px">
      <div class="panel-header"><div><h2>${escapeHtml(profile.department)} 추가 확인사항</h2><p>조기졸업도 학과 졸업평가를 면제하지 않습니다.</p></div></div>
      ${researchTimeline}
      <div class="checklist early-checklist">
        ${profile.graduationEvaluation.checklist.map((item) => `<div class="checklist-item"><span class="task-dot" style="background:${item.completed ? "var(--success)" : "var(--warning)"}"></span><div><strong>${escapeHtml(item.label)}</strong><span class="field-hint early-status">${item.completed ? "완료" : "조기졸업 전 완료 필요"}</span></div></div>`).join("")}
      </div>
    </section>
  </div>`;

const inputs = {
  semester: document.querySelector("#semester"),
  gpa: document.querySelector("#gpa"),
  credits: document.querySelector("#credits"),
  progress: document.querySelector("#requirementsProgress"),
};

function renderResult() {
  const values = {
    semester: Number(inputs.semester.value),
    gpa: Number(inputs.gpa.value),
    credits: Number(inputs.credits.value),
    progress: Number(inputs.progress.value),
  };
  const criteria = [
    { label: "등록학기", detail: "6학기 이상 7학기 이하", passed: values.semester >= 6 && values.semester <= 7, value: `${values.semester}학기` },
    { label: "총평점", detail: "일반 조기졸업 샘플 기준 4.00 이상", passed: values.gpa >= 4, value: values.gpa.toFixed(2) },
    { label: "총 졸업학점", detail: `${profile.department} 기준 ${profile.totalCredits.required}학점`, passed: values.credits >= profile.totalCredits.required, value: `${values.credits}학점` },
    ...(profile.dsEducation.exception
      ? [{
          label: "DS 학과 지정 예외",
          detail: profile.dsEducation.detail,
          passed: profile.dsEducation.completed >= profile.dsEducation.required,
          value: `${profile.dsEducation.completed}/${profile.dsEducation.required}학점`,
        }]
      : []),
    { label: "전체 졸업요건", detail: "교양·전공·3품·졸업평가 100%", passed: values.progress >= 100, value: `${values.progress}%` },
  ];
  const passedCount = criteria.filter((item) => item.passed).length;
  const allPassed = passedCount === criteria.length;

  document.querySelector("#resultTitle").textContent = allPassed ? "조기졸업 요건을 충족했어요" : `${criteria.length - passedCount}개 조건을 더 확인하세요`;
  document.querySelector("#resultDescription").textContent = allPassed ? "현재 입력값 기준으로 학교 신청 절차를 확인할 단계입니다." : "부족한 수치를 채워도 학과 최종 승인이 필요합니다.";
  document.querySelector("#resultBadge").className = `badge ${allPassed ? "badge-success" : "badge-warning"}`;
  document.querySelector("#resultBadge").textContent = `${passedCount}/${criteria.length} 충족`;
  document.querySelector("#criteriaList").innerHTML = criteria
    .map((item) => `<div class="criteria-item"><div class="criteria-copy"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.detail)}</span></div><div class="criteria-status"><strong>${escapeHtml(item.value)}</strong><span class="badge ${item.passed ? "badge-success" : "badge-danger"}">${item.passed ? "충족" : "부족"}</span></div></div>`)
    .join("");

  const gaps = [];
  if (values.gpa < 4) gaps.push(`GPA ${(4 - values.gpa).toFixed(2)}점`);
  if (values.credits < profile.totalCredits.required) gaps.push(`${profile.totalCredits.required - values.credits}학점`);
  if (values.progress < 100) gaps.push(`전체 요건 ${100 - values.progress}%`);
  const callout = document.querySelector("#resultCallout");
  callout.className = `alert ${allPassed ? "alert-success" : "alert-warning"}`;
  const creditGap = Math.max(0, profile.totalCredits.required - values.credits);
  const progressGap = Math.max(0, 100 - values.progress);
  const advice = allPassed
    ? "모든 수치 조건을 충족했습니다. 신청기간과 학과별 졸업평가 일정을 확인하세요."
    : creditGap > 0
      ? `총 졸업학점 ${creditGap}학점만 채우면 조기졸업 요건에 더 가까워져요. 남은 과목은 다음 학기 수강계획에서 우선 배치해보세요.`
      : progressGap > 0
        ? `전체 졸업요건 ${progressGap}%p만 더 채우면 조기졸업 검토 단계로 넘어갈 수 있어요. 미완료 요건을 먼저 확인해보세요.`
        : "등록학기 범위를 확인하면 조기졸업 가능성을 더 정확히 판단할 수 있어요.";
  callout.innerHTML = allPassed
    ? escapeHtml(advice)
    : `<strong>현재 부족한 부분: ${escapeHtml(gaps.join(", ") || "등록학기 범위 확인")}</strong><span class="callout-ai-answer">${escapeHtml(advice)}</span>`;
}

Object.values(inputs).forEach((input) => input.addEventListener("input", renderResult));
renderResult();

document.querySelector("#saveEarly").addEventListener("click", async () => {
  profile.currentSemester = Number(inputs.semester.value);
  profile.gpa = Number(inputs.gpa.value);
  profile.totalCredits.completed = Number(inputs.credits.value);
  profile.earlyGraduation = true;
  await saveProfile(profile);
  showToast("조기졸업 진단값을 저장했습니다.");
});
