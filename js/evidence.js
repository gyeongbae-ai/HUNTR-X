import { getProfile } from "./auth.js";
import { escapeHtml, initAppShell } from "./common.js";
import {
  ensureEvidenceData,
  REQUIREMENT_OPTIONS,
  STORAGE_KEYS,
} from "./data.js";

const profile = initAppShell({ page: "evidence", title: "이수내역·문서 등록" });
if (!profile) throw new Error("Profile required");
ensureEvidenceData(profile);

const completedCourses = profile.courses.filter((course) => course.completed);
const recordedCredits = completedCourses.reduce((sum, course) => sum + Number(course.credits || 0), 0);
const requirementLabel = Object.fromEntries(REQUIREMENT_OPTIONS.map((item) => [item.id, item.label]));

function courseSourceLabel(course) {
  return course.verified ? `${course.source} · 공식 대조` : course.source;
}

function renderCourseBadges(course) {
  return (course.badges || [])
    .map((badge) => `<span>${escapeHtml(badge)}</span>`)
    .join("");
}

function renderCourseRows() {
  return completedCourses
    .map(
      (course) => `
        <tr>
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
    return `<div class="empty-evidence"><strong>등록된 문서가 없습니다.</strong><span>이미지로 입력하기에서 GLS 또는 챌린지스퀘어 문서를 등록하세요.</span></div>`;
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
        <p>저장된 교과목, 비교과 활동, 문서 반영 기록을 확인합니다.</p>
      </div>
      <div class="page-header-actions">
        <a class="btn btn-secondary" href="requirements.html#evidence">요건별 인정내역</a>
        <button class="btn" id="openEvidenceImport" type="button">이미지로 입력하기</button>
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
        <button class="tab-button active" type="button" data-record-tab="courses">교과목·성적</button>
        <button class="tab-button" type="button" data-record-tab="programs">비교과 이수</button>
        <button class="tab-button" type="button" data-record-tab="imports">문서 등록 기록</button>
      </div>
      <section class="panel record-tab-panel" id="record-courses">
        <div class="panel-header"><div><h2>GLS 교과목·성적</h2><p>과목별 학점, 성적, 인정 요건을 확인합니다.</p></div><span class="badge">${completedCourses.length}과목</span></div>
        <div class="evidence-table-wrap"><table class="course-table evidence-table"><thead><tr><th>수강학기</th><th>학수번호</th><th>교과목명</th><th>학점</th><th>성적</th><th>인정 요건</th><th>출처</th></tr></thead><tbody>${renderCourseRows()}</tbody></table></div>
      </section>
      <section class="panel record-tab-panel hidden" id="record-programs">
        <div class="panel-header"><div><h2>챌린지스퀘어 비교과 이수</h2><p>최종 이수 상태와 인증영역을 확인합니다.</p></div><span class="badge">${profile.nonCurricular.length}건</span></div>
        <div class="program-evidence-grid">${renderProgramCards()}</div>
      </section>
      <section class="panel record-tab-panel hidden" id="record-imports">
        <div class="panel-header"><div><h2>문서 등록 기록</h2><p>계정에 반영된 이미지 및 PDF 기록입니다.</p></div><span class="badge">${profile.evidenceImports.length}회</span></div>
        ${renderImportRecords()}
      </section>
    </section>
  </div>`;

document.body.insertAdjacentHTML("beforeend", `
  <div class="evidence-import-modal hidden" id="evidenceImportModal" role="dialog" aria-modal="true" aria-labelledby="evidenceImportTitle">
    <button class="modal-backdrop" type="button" data-close-evidence-import aria-label="이미지 입력 닫기"></button>
    <div class="evidence-import-dialog">
      <header>
        <div><p class="eyebrow">Import records</p><h2 id="evidenceImportTitle">이미지로 이수내역 입력</h2><p>GLS와 챌린지스퀘어 문서를 선택해 내용을 확인합니다.</p></div>
        <button class="modal-close" type="button" data-close-evidence-import aria-label="닫기">×</button>
      </header>
      <div class="evidence-import-content">
        <div class="evidence-source-grid">
          <article class="evidence-source-card" data-document-type="gls">
            <div class="source-card-title"><span class="source-symbol">GLS</span><div><h3>학업성적표·이수내역</h3><p>교과목, 학수번호, 학점, 성적, 수강학기를 추출합니다.</p></div></div>
            <label class="evidence-upload-zone" for="glsFile" data-upload-type="gls"><strong>GLS 캡처·성적표·PDF 선택</strong><span>클릭, 드래그 앤 드롭, Ctrl+V 붙여넣기 가능</span><input id="glsFile" type="file" accept="image/png,image/jpeg,application/pdf" /></label>
            <div class="upload-preview hidden" id="glsPreview"></div>
            <div class="source-actions"><button class="btn" type="button" data-analyze="gls">이미지 분석</button><button class="btn btn-secondary" type="button" data-sample="gls">샘플로 체험</button></div>
            <div class="alert hidden" id="glsStatus"></div>
          </article>
          <article class="evidence-source-card" data-document-type="challenge">
            <div class="source-card-title"><span class="source-symbol source-symbol-pink">CS</span><div><h3>챌린지스퀘어 비교과</h3><p>프로그램명, 이수일, 시간, 인증영역을 추출합니다.</p></div></div>
            <label class="evidence-upload-zone" for="challengeFile" data-upload-type="challenge"><strong>비교과 이수내역 캡처 선택</strong><span>클릭, 드래그 앤 드롭, Ctrl+V 붙여넣기 가능</span><input id="challengeFile" type="file" accept="image/png,image/jpeg,application/pdf" /></label>
            <div class="upload-preview hidden" id="challengePreview"></div>
            <div class="source-actions"><button class="btn" type="button" data-analyze="challenge">이미지 분석</button><button class="btn btn-secondary" type="button" data-sample="challenge">샘플로 체험</button></div>
            <div class="alert hidden" id="challengeStatus"></div>
          </article>
          <article class="evidence-source-card" data-document-type="roadmap">
            <div class="source-card-title"><span class="source-symbol source-symbol-blue">MAP</span><div><h3>교과 과정 로드맵</h3><p>학과별 권장 수강 순서를 참고자료로 첨부합니다.</p></div></div>
            <label class="evidence-upload-zone" for="roadmapFile" data-upload-type="roadmap"><strong>로드맵 이미지 또는 PDF 선택</strong><span>전공 로드맵, 교육과정표, 학과 안내자료</span><input id="roadmapFile" type="file" accept="image/png,image/jpeg,application/pdf" /></label>
            <div class="upload-preview hidden" id="roadmapPreview"></div>
            <div class="source-actions"><button class="btn btn-secondary" type="button" data-sample="roadmap">참고자료로 등록</button></div>
            <div class="alert hidden" id="roadmapStatus"></div>
          </article>
        </div>
        <div class="recognition-flow" aria-label="문서 인식 과정">
          <div><strong>01</strong><span>이미지 등록</span></div><i>→</i>
          <div><strong>02</strong><span>문서 인식</span></div><i>→</i>
          <div><strong>03</strong><span>사용자 검토</span></div><i>→</i>
          <div><strong>04</strong><span>요건 연결</span></div>
        </div>
        <div class="alert">개인정보가 포함된 문서는 본인 계정에서만 등록하고, 반영 전 인식 결과를 확인하세요.</div>
      </div>
    </div>
  </div>`);

function activateRecordTab(name) {
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
}

document.querySelectorAll("[data-record-tab]").forEach((button) => {
  button.addEventListener("click", () => activateRecordTab(button.dataset.recordTab));
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

async function setSelectedFile(type, file) {
  if (!file) return;
  const input = getInput(type);
  const preview = getPreview(type);
  const status = getStatus(type);
  const transfer = new DataTransfer();
  transfer.items.add(file);
  input.files = transfer.files;
  const dataUrl = await makePreview(file).catch(() => null);
  preview.classList.remove("hidden");
  preview.innerHTML = dataUrl ? `<img src="${dataUrl}" alt="선택한 이미지 미리보기" /><span>${escapeHtml(file.name)}</span>` : `<strong>PDF</strong><span>${escapeHtml(file.name)}</span>`;
  preview.dataset.preview = dataUrl || "";
  status.textContent = `${file.name} 파일을 불러왔습니다.`;
  status.className = "alert alert-success";
}

document.querySelectorAll("input[type=file]").forEach((input) => {
  input.addEventListener("change", async () => {
    const type = input.id === "glsFile" ? "gls" : "challenge";
    const file = input.files[0];
    await setSelectedFile(input.id === "roadmapFile" ? "roadmap" : type, file);
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
    await setSelectedFile(type, event.dataTransfer.files[0]);
  });
});

document.addEventListener("paste", async (event) => {
  const file = [...event.clipboardData.files].find((item) => item.type.startsWith("image/") || item.type === "application/pdf");
  if (!file) return;
  const activeType = document.activeElement?.closest?.("[data-upload-type]")?.dataset.uploadType || activeUploadType;
  await setSelectedFile(activeType, file);
});

document.querySelectorAll("[data-analyze]").forEach((button) => {
  button.addEventListener("click", async () => {
    const type = button.dataset.analyze;
    if (type === "roadmap") return;
    const input = getInput(type);
    const status = getStatus(type);
    const file = input.files[0];
    if (!file) {
      status.textContent = "먼저 인식할 이미지 또는 PDF를 선택해 주세요.";
      status.className = "alert alert-warning";
      return;
    }
    status.textContent = "이미지를 읽고 표 구조를 분석하고 있습니다...";
    status.className = "alert";
    const body = new FormData();
    body.append("document", file);
    body.append("model", "document-parse");
    body.append("ocr", "force");
    try {
      const response = await fetch("/api/parse", { method: "POST", body });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || "API unavailable");
      saveDraft(type, { fileName: file.name, provider: "Upstage Document Parse", extractedText: extractParsedText(payload), previewDataUrl: document.querySelector(type === "gls" ? "#glsPreview" : "#challengePreview").dataset.preview || "" });
    } catch {
      const sample = createSample(type);
      saveDraft(type, { fileName: file.name, provider: "수동 검토 모드", previewDataUrl: document.querySelector(type === "gls" ? "#glsPreview" : "#challengePreview").dataset.preview || "", ...sample });
    }
  });
});
