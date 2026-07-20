import { escapeHtml, initAppShell } from "./common.js";
import {
  formatNumber,
  getCompletionRatio,
  getEvidenceForRequirement,
  getRequirementItems,
  getStatus,
  REQUIREMENT_OPTIONS,
} from "./data.js";

const profile = initAppShell({ page: "requirements", title: "졸업요건 상세" });
if (!profile) throw new Error("Profile required");

const requirements = getRequirementItems(profile);
const requirementLabels = Object.fromEntries(REQUIREMENT_OPTIONS.map((item) => [item.id, item.label]));
requirementLabels.registration = "등록학기";
requirementLabels.gpa = "졸업 평점";

function getStatusMeta(item) {
  const status = getStatus(item);
  if (item.exception && status === "complete") return { className: "info", label: "학과 예외 충족" };
  if (status === "complete") return { className: "success", label: "충족" };
  if (status === "warning") return { className: "warning", label: "보완 필요" };
  return { className: "danger", label: "부족" };
}

function renderRequirementChips(course, selectedId) {
  const ids = [...new Set(course.requirementIds || [])];
  return ids.map((id) => `
    <span class="${id === selectedId ? "selected" : ""}">${escapeHtml(requirementLabels[id] || id)}</span>`).join("");
}

function renderCourseEvidence(courses, selectedId) {
  if (!courses.length) return "";
  return `
    <section class="requirement-detail-section">
      <div class="requirement-detail-heading">
        <div>
          <p class="eyebrow">Course evidence</p>
          <h3>인정 교과목 ${courses.length}개</h3>
          <p>한 과목이 여러 졸업요건에 인정되는 관계를 함께 표시합니다.</p>
        </div>
      </div>
      <div class="evidence-table-wrap">
        <table class="evidence-table requirement-relation-table">
          <thead><tr><th>교과목</th><th>학기</th><th>학점·성적</th><th>동시 인정 요건</th></tr></thead>
          <tbody>
            ${courses.map((course) => `
              <tr>
                <td><strong>${escapeHtml(course.name)}</strong><span class="course-area-label">${escapeHtml(course.code)}</span></td>
                <td>${escapeHtml(course.term)}</td>
                <td>${formatNumber(course.credits)}학점 · <span class="grade-chip">${escapeHtml(course.grade)}</span></td>
                <td>
                  <div class="requirement-relation-chips">${renderRequirementChips(course, selectedId)}</div>
                  ${(course.requirementIds || []).length > 1 ? `<small class="relation-count">${course.requirementIds.length}개 요건에 동시 인정</small>` : ""}
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderProgramEvidence(programs) {
  if (!programs.length) return "";
  return `
    <section class="requirement-detail-section">
      <div class="requirement-detail-heading"><div><p class="eyebrow">Activity evidence</p><h3>인정 비교과 ${programs.length}개</h3></div></div>
      <div class="program-evidence-grid">
        ${programs.map((program) => `
          <article class="program-evidence-card">
            <span class="badge badge-success">${escapeHtml(program.certificationArea)} 영역</span>
            <h3>${escapeHtml(program.title)}</h3>
            <p>${escapeHtml(program.organizer)} · ${escapeHtml(program.completedAt)}</p>
            <div class="evidence-card-footer"><strong>${formatNumber(program.hours)}시간</strong><span>${escapeHtml(program.source)}</span></div>
          </article>`).join("")}
      </div>
    </section>`;
}

function renderChecklist(item) {
  const rows = item.id === "poom"
    ? profile.poom.map((entry) => ({ label: entry.label, completed: entry.completed }))
    : item.id === "graduationEvaluation"
      ? profile.graduationEvaluation.checklist
      : [];
  if (!rows.length) return "";
  return `
    <section class="requirement-detail-section">
      <div class="requirement-detail-heading"><div><p class="eyebrow">Step status</p><h3>${item.id === "poom" ? "3품 영역별 현황" : "졸업평가 단계"}</h3></div></div>
      <div class="diagnosis-detail-checklist">
        ${rows.map((entry) => `
          <span class="${entry.completed ? "complete" : ""}">
            <i aria-hidden="true">${entry.completed ? "✓" : "·"}</i>${escapeHtml(entry.label)}
          </span>`).join("")}
      </div>
    </section>`;
}

function renderSelectedRequirement(item) {
  const evidence = getEvidenceForRequirement(profile, item.id);
  const meta = getStatusMeta(item);
  const percent = Math.round(getCompletionRatio(item) * 100);
  const remaining = Math.max(0, item.required - item.completed);
  const hasEvidence = evidence.courses.length || evidence.programs.length || ["poom", "graduationEvaluation"].includes(item.id);

  return `
    <div class="requirement-focus-head">
      <div>
        <p class="eyebrow">Requirement detail</p>
        <h2>${escapeHtml(item.label)}</h2>
        <p>${escapeHtml(item.description)}</p>
      </div>
      <span class="badge badge-${meta.className}">${meta.label}</span>
    </div>
    <div class="requirement-focus-summary">
      <div><span>현재 반영값</span><strong>${formatNumber(item.completed)} / ${formatNumber(item.required)}${escapeHtml(item.suffix)}</strong></div>
      <div><span>충족률</span><strong>${percent}%</strong></div>
      <div><span>남은 기준</span><strong>${remaining > 0 ? `${formatNumber(remaining)}${escapeHtml(item.suffix)}` : "충족"}</strong></div>
    </div>
    ${item.exception ? `<div class="alert"><strong>${escapeHtml(item.exceptionLabel || "학과 예외 기준 적용")}</strong><br />${escapeHtml(item.detail || profile.dsEducation?.detail || "")}</div>` : ""}
    ${renderChecklist(item)}
    ${renderCourseEvidence(evidence.courses, item.id)}
    ${renderProgramEvidence(evidence.programs)}
    ${!hasEvidence ? `<div class="diagnosis-empty-state">이 항목은 직접 입력한 현재 값으로 진단합니다. 값 수정은 이수내역·문서 등록 페이지에서 할 수 있습니다.</div>` : ""}
    <div class="requirement-detail-actions">
      <a class="btn btn-secondary" href="dashboard.html">진단 대시보드로 돌아가기</a>
      <a class="btn" href="evidence.html#edit">이수정보 수정</a>
    </div>`;
}

document.querySelector("#pageContent").innerHTML = `
  <div class="page-content requirement-detail-page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Graduation requirements</p>
        <h1>졸업요건 상세</h1>
        <p>진단 항목을 하나씩 확인하고, 교과목의 중복 인정 관계까지 살펴봅니다.</p>
      </div>
      <a class="btn btn-secondary" href="dashboard.html">진단 대시보드</a>
    </div>

    <div class="requirement-detail-layout">
      <nav class="requirement-detail-nav" aria-label="졸업요건 항목">
        <div><strong>진단 항목</strong><span>${requirements.length}개 요건</span></div>
        ${requirements.map((item) => {
          const meta = getStatusMeta(item);
          return `<a href="#${item.id}" data-requirement-link="${item.id}"><span>${escapeHtml(item.label)}</span><i class="${meta.className}" aria-label="${meta.label}"></i></a>`;
        }).join("")}
      </nav>
      <main class="panel requirement-focus-panel" id="requirementFocus"></main>
    </div>
  </div>`;

function selectRequirement() {
  const id = window.location.hash.slice(1);
  const selected = requirements.find((item) => item.id === id) || requirements[0];
  document.querySelectorAll("[data-requirement-link]").forEach((link) => {
    const active = link.dataset.requirementLink === selected.id;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.querySelector("#requirementFocus").innerHTML = renderSelectedRequirement(selected);
  document.title = `GradQuest | ${selected.label} 상세`;
}

selectRequirement();
window.addEventListener("hashchange", selectRequirement);
