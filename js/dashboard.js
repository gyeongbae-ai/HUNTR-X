import { escapeHtml, initAppShell } from "./common.js";
import {
  calculateProgress,
  formatNumber,
  getCompletionRatio,
  getRequirementItems,
  getStatus,
} from "./data.js";

const profile = initAppShell({ page: "dashboard", title: "진단 대시보드" });
if (!profile) throw new Error("Profile required");

const requirements = getRequirementItems(profile);
const progress = calculateProgress(profile);
const completedCount = requirements.filter((item) => getStatus(item) === "complete").length;
const remainingCount = requirements.length - completedCount;

function getStatusMeta(item) {
  const status = getStatus(item);
  if (item.exception && status === "complete") return { className: "info", label: "학과 예외 충족" };
  if (status === "complete") return { className: "success", label: "충족" };
  if (status === "warning") return { className: "warning", label: "보완 필요" };
  return { className: "danger", label: "부족" };
}

function renderPoomStatus(item) {
  const meta = getStatusMeta(item);
  const percent = Math.round(getCompletionRatio(item) * 100);
  return `
    <article class="diagnosis-item diagnosis-item-poom">
      <div class="diagnosis-item-head">
        <div><span>인증 요건</span><h3>${escapeHtml(item.label)}</h3></div>
        <span class="badge badge-${meta.className}">${meta.label}</span>
      </div>
      <div class="diagnosis-value"><strong>${formatNumber(item.completed)} / ${formatNumber(item.required)}${item.suffix}</strong><span>${percent}%</span></div>
      <div class="poom-status-row" aria-label="3품 영역별 충족 현황">
        ${profile.poom.map((poom) => `
          <div class="poom-status ${poom.completed ? "completed" : ""}" title="${escapeHtml(poom.label)} ${poom.completed ? "완료" : "미완료"}">
            <span>${escapeHtml(poom.label.slice(0, 1))}</span>
            <small>${escapeHtml(poom.label)}</small>
          </div>`).join("")}
      </div>
      <p>${escapeHtml(item.description)}</p>
      <a class="diagnosis-detail-button" href="requirements.html#${item.id}">자세히 보기</a>
    </article>`;
}

function renderGraduationEvaluationStatus(item) {
  const meta = getStatusMeta(item);
  const checklist = profile.graduationEvaluation?.checklist || [];
  const remaining = Math.max(0, Number(item.required || 0) - Number(item.completed || 0));
  return `
    <article class="diagnosis-item diagnosis-item-evaluation">
      <div class="diagnosis-item-head">
        <div><span>단계형 요건</span><h3>${escapeHtml(item.label)}</h3></div>
        <span class="badge badge-${meta.className}">${meta.label}</span>
      </div>
      <div class="diagnosis-evaluation-summary">
        <strong>${formatNumber(item.completed)}단계 완료</strong>
        <span>${remaining > 0 ? `${formatNumber(remaining)}단계 남음` : "모든 단계 완료"}</span>
      </div>
      <ol class="diagnosis-evaluation-steps" aria-label="${escapeHtml(item.label)} 단계별 완료 현황">
        ${checklist.map((step, index) => `
          <li class="${step.completed ? "completed" : ""}">
            <span class="diagnosis-evaluation-step-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
            <div><strong>${escapeHtml(step.label)}</strong><small>${step.completed ? "완료한 단계" : "확인이 필요한 단계"}</small></div>
          </li>`).join("")}
      </ol>
      <p>${escapeHtml(item.description)}</p>
      <a class="diagnosis-detail-button" href="requirements.html#${item.id}">자세히 보기</a>
    </article>`;
}

function renderDiagnosisItem(item) {
  if (item.id === "poom") return renderPoomStatus(item);
  if (item.id === "graduationEvaluation") return renderGraduationEvaluationStatus(item);
  const meta = getStatusMeta(item);
  const percent = Math.round(getCompletionRatio(item) * 100);
  const remaining = Math.max(0, item.required - item.completed);
  return `
    <article class="diagnosis-item">
      <div class="diagnosis-item-head">
        <div><span>${item.suffix === "학점" ? "학점 요건" : "비학점 요건"}</span><h3>${escapeHtml(item.label)}</h3></div>
        <span class="badge badge-${meta.className}">${meta.label}</span>
      </div>
      <div class="diagnosis-value">
        <strong>${formatNumber(item.completed)} / ${formatNumber(item.required)}${escapeHtml(item.suffix)}</strong>
        <span>${remaining > 0 ? `${formatNumber(remaining)}${escapeHtml(item.suffix)} 부족` : "기준 충족"}</span>
      </div>
      <div class="mini-progress" aria-label="${escapeHtml(item.label)} ${percent}% 충족">
        <div class="mini-progress-fill ${meta.className === "success" || meta.className === "info" ? "complete" : meta.className}" style="width:${percent}%"></div>
      </div>
      <p>${escapeHtml(item.description)}</p>
      <a class="diagnosis-detail-button" href="requirements.html#${item.id}">자세히 보기</a>
    </article>`;
}

document.querySelector("#pageContent").innerHTML = `
  <div class="page-content diagnosis-page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Graduation diagnosis</p>
        <h1>${escapeHtml(profile.name)}님의 진단 현황</h1>
        <p>${escapeHtml(profile.admissionYear)}학번 · ${escapeHtml(profile.department)} · ${escapeHtml(profile.degreeTypeLabel)}</p>
      </div>
      <a class="btn btn-secondary" href="evidence.html#edit">이수정보 수정</a>
    </div>

    <section class="panel diagnosis-overview">
      <div class="progress-ring" style="--progress:${progress * 3.6}deg" aria-label="전체 진행률 ${progress}%">
        <div class="progress-ring-content"><strong>${progress}%</strong><span>전체 진행률</span></div>
      </div>
      <div class="diagnosis-overview-copy">
        <p class="eyebrow">Current status</p>
        <h2>${progress >= 85 ? "졸업이 가까워졌어요." : progress >= 65 ? "핵심 요건을 차근차근 채우고 있어요." : "우선순위가 필요한 시점이에요."}</h2>
        <p>현재 입력값 기준 ${requirements.length}개 진단 항목 중 ${completedCount}개를 충족했습니다.</p>
        <div class="diagnosis-counts">
          <span><strong>${completedCount}</strong> 충족</span>
          <span><strong>${remainingCount}</strong> 확인·보완</span>
          <span><strong>2026.07</strong> 기준 업데이트</span>
        </div>
      </div>
      <a class="diagnosis-next-link" href="personal-roadmap.html"><span>다음 단계</span><strong>개인 로드맵 보기</strong><i aria-hidden="true">→</i></a>
    </section>

    ${profile.dsEducation.exception ? `<div class="alert diagnosis-exception"><strong>${escapeHtml(profile.dsEducation.exceptionLabel)}</strong><span>일반 DS 과목 대신 ${escapeHtml(profile.dsEducation.detail)} 이수 여부로 판정했습니다.</span></div>` : ""}

    <section class="panel unified-diagnosis">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Requirement gap map</p>
          <h2>졸업요건 충족 현황</h2>
          <p>학점, 등록, 평점, 3품, 학과 졸업평가를 한 화면에서 확인합니다.</p>
        </div>
        <a class="text-link" href="evidence.html#edit">이수내역 수정</a>
      </div>
      <div class="diagnosis-item-grid">${requirements.map(renderDiagnosisItem).join("")}</div>
    </section>

    <div class="alert alert-warning">GradQuest는 학사정보 확인을 돕는 보조 서비스입니다. 최종 졸업 판정과 최신 학과 기준은 GLS 및 학과사무실에서 확인하세요.</div>
  </div>`;
