import { escapeHtml, initAppShell } from "./common.js";
import {
  formatNumber,
  getCompletionRatio,
  getEvidenceForRequirement,
  getPriorityCourseRecommendations,
  getRequirementItems,
  getStatus,
  REQUIREMENT_OPTIONS,
} from "./data.js?v=20260724-priority-courses";
import {
  CONVERGENCE_TRACK_CONTACTS,
  LINKED_MAJOR_CONTACTS,
  MICRODEGREE_CONTACTS,
} from "./program-contact-data.js";

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

function renderPriorityCourseRecommendations(item) {
  const courses = getPriorityCourseRecommendations(profile, item.id);
  if (!courses.length) return "";
  const isDs = item.id === "dsEducation";
  const panelId = `priorityCourses-${item.id}`;
  return `
    <section class="requirement-detail-section priority-course-section">
      <div class="requirement-detail-heading priority-course-heading">
        <div>
          <p class="eyebrow">Priority course list</p>
          <h3>${isDs ? "DS 지정과목 우선 수강 목록" : "전공과목 우선 수강 목록"}</h3>
          <p>현재 이수내역에서 완료한 과목을 제외하고 우선순위에 따라 정리했습니다.</p>
        </div>
        <button class="btn btn-secondary priority-course-toggle" type="button" aria-expanded="false" aria-controls="${panelId}">
          <span>목록 펼치기</span><i aria-hidden="true">⌄</i>
        </button>
      </div>
      <div class="priority-course-list hidden" id="${panelId}">
        ${courses.map((course) => `
          <article class="priority-course-item">
            <span class="priority-course-rank">${String(course.priority).padStart(2, "0")}</span>
            <div class="priority-course-main">
              <div><strong>${escapeHtml(course.name)}</strong><span>${escapeHtml(course.code)}</span></div>
              <p>${escapeHtml(course.reason)}</p>
            </div>
            <div class="priority-course-meta">
              <span>${formatNumber(course.credits)}학점</span>
              <span>${escapeHtml(course.semester)}</span>
              <span>${escapeHtml(course.target)}</span>
            </div>
          </article>`).join("")}
        <p class="priority-course-notice">실제 개설 학기, 선수과목 및 최종 인정 여부는 수강신청 전 GLS 수강편람과 학과 교육과정에서 확인하세요.</p>
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

function renderVerificationSource(item) {
  const isGeneralEducation = ["coreGeneral", "balancedGeneral", "dsEducation", "internationalTotal", "internationalMajor"].includes(item.id);
  const href = item.sourceUrl || (isGeneralEducation ? profile.generalEducationSourceUrl : profile.sourceUrl);
  if (!href) return "";
  const title = isGeneralEducation ? "학번별 교양·DS 기준" : `${profile.department} 졸업요건 근거`;
  const notice = isGeneralEducation
    ? profile.generalEducationNotice
    : "학과 공지와 교육과정에서 확인된 내용을 반영했으며, 졸업예정학기에는 GLS 졸업자가진단으로 최종 확인합니다.";
  return `
    <div class="requirement-source-note">
      <div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(notice)}</span></div>
      <a class="text-link" href="${escapeHtml(href)}" target="_blank" rel="noreferrer">공식 기준 확인</a>
    </div>`;
}

function renderProgramNames(programs, includeCredits = true) {
  return `<div class="contact-program-list">${programs.map((program) => {
    const [name, credits, note] = Array.isArray(program) ? program : [program];
    return `<span><strong>${escapeHtml(name)}</strong>${includeCredits && credits ? `<small>${formatNumber(credits)}학점</small>` : ""}${note ? `<em>${escapeHtml(note)}</em>` : ""}</span>`;
  }).join("")}</div>`;
}

function renderContactDirectory(item) {
  let title = "";
  let description = "";
  let rows = [];
  let sourceUrl = "";
  let includeLocation = false;

  if (item.id === "microdegree") {
    title = "마이크로디그리 주관학과·연락처";
    description = "동일한 주관학과와 연락처는 한 행으로 묶었습니다.";
    rows = MICRODEGREE_CONTACTS;
    sourceUrl = "https://www.skku.edu/skku/campus/skk_comm/notice02.do?articleNo=136054&mode=view";
  } else if (item.id === "secondaryMajor" && profile.degreeType === "convergence_track") {
    title = "융합트랙 주관부서·연락처";
    description = "같은 행정실과 연락처가 담당하는 트랙은 한 행에 모았습니다.";
    rows = CONVERGENCE_TRACK_CONTACTS;
    sourceUrl = "https://www.skku.edu/skku/campus/skk_comm/notice02.do?articleNo=136054&mode=view";
  } else if (item.id === "secondaryMajor" && profile.degreeType === "linked_major") {
    title = "연계전공 주관부서·연락처·위치";
    description = "같은 사무실이 담당하는 전공은 한 칸에 합쳐 표시했습니다.";
    rows = LINKED_MAJOR_CONTACTS;
    includeLocation = true;
  }

  if (!rows.length) return "";
  const programCount = rows.reduce((sum, row) => sum + row.programs.length, 0);

  return `
    <section class="requirement-detail-section contact-directory-section">
      <div class="requirement-detail-heading contact-directory-heading">
        <div>
          <p class="eyebrow">Academic contacts</p>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)} 총 ${programCount}개 과정을 확인할 수 있습니다.</p>
        </div>
        ${sourceUrl ? `<a class="text-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">학교 공지 확인</a>` : ""}
      </div>
      <div class="evidence-table-wrap contact-directory-wrap">
        <table class="evidence-table contact-directory-table">
          <thead><tr><th>${includeLocation ? "연계전공" : "과정"}</th><th>주관부서</th><th>연락처</th>${includeLocation ? "<th>위치</th>" : ""}</tr></thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                <td>${renderProgramNames(row.programs, !includeLocation)}</td>
                <td><strong>${escapeHtml(row.department)}</strong></td>
                <td><a href="tel:${escapeHtml(row.phone.replace(/-/g, ""))}">${escapeHtml(row.phone)}</a></td>
                ${includeLocation ? `<td>${escapeHtml(row.location)}</td>` : ""}
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <p class="contact-directory-note">안내자료 기준 정보이며, 신청 전 최신 학사공지와 해당 주관부서에서 운영 여부 및 연락처를 다시 확인해 주세요.</p>
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
    ${renderVerificationSource(item)}
    ${renderChecklist(item)}
    ${renderCourseEvidence(evidence.courses, item.id)}
    ${renderPriorityCourseRecommendations(item)}
    ${renderProgramEvidence(evidence.programs)}
    ${!hasEvidence ? `<div class="diagnosis-empty-state">이 항목은 직접 입력한 현재 값으로 진단합니다. 값 수정은 이수내역·문서 등록 페이지에서 할 수 있습니다.</div>` : ""}
    ${renderContactDirectory(item)}
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
  const priorityToggle = document.querySelector(".priority-course-toggle");
  priorityToggle?.addEventListener("click", () => {
    const panel = document.querySelector(`#${priorityToggle.getAttribute("aria-controls")}`);
    const expanded = priorityToggle.getAttribute("aria-expanded") === "true";
    priorityToggle.setAttribute("aria-expanded", String(!expanded));
    priorityToggle.querySelector("span").textContent = expanded ? "목록 펼치기" : "목록 접기";
    priorityToggle.querySelector("i").textContent = expanded ? "⌄" : "⌃";
    panel?.classList.toggle("hidden", expanded);
  });
  document.title = `GradQuest | ${selected.label} 상세`;
}

selectRequirement();
window.addEventListener("hashchange", selectRequirement);
