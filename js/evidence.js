import { getProfile } from "./auth.js";
import { escapeHtml, initAppShell } from "./common.js";
import {
  ensureEvidenceData,
  getEvidenceForRequirement,
  getRequirementItems,
  REQUIREMENT_OPTIONS,
  STORAGE_KEYS,
} from "./data.js";

const profile = initAppShell({ page: "evidence", title: "이수 내역·문서 등록" });
if (!profile) throw new Error("Profile required");
ensureEvidenceData(profile);

const completedCourses = profile.courses.filter((course) => course.completed);
const recordedCredits = completedCourses.reduce((sum, course) => sum + Number(course.credits || 0), 0);
const requirementLabel = Object.fromEntries(REQUIREMENT_OPTIONS.map((item) => [item.id, item.label]));

function renderRequirementEvidence(item) {
  const evidence = getEvidenceForRequirement(profile, item.id);
  const preview = [
    ...evidence.courses.slice(0, 3).map((course) => course.name),
    ...evidence.programs.slice(0, 2).map((program) => program.title),
  ];
  return `
    <article class="evidence-requirement-card">
      <div class="evidence-requirement-head">
        <div><span>${escapeHtml(item.label)}</span><strong>${item.completed}/${item.required}${item.suffix}</strong></div>
        <span class="badge">내역 ${evidence.courses.length + evidence.programs.length}건</span>
      </div>
      <p>${preview.length ? preview.map(escapeHtml).join(" · ") : "연결된 교과목·비교과 내역이 없습니다."}</p>
      <div class="evidence-card-footer"><span>연결 교과 ${evidence.credits}학점</span><a class="text-link" href="requirements.html#evidence">상세 확인</a></div>
    </article>`;
}

function renderCourseRows() {
  return completedCourses
    .map(
      (course) => `
        <tr>
          <td>${escapeHtml(course.term)}</td>
          <td><strong>${escapeHtml(course.code)}</strong></td>
          <td>${escapeHtml(course.name)}</td>
          <td>${course.credits}</td>
          <td><span class="grade-chip">${escapeHtml(course.grade)}</span></td>
          <td><div class="requirement-chip-row">${course.requirementIds.map((id) => `<span>${escapeHtml(requirementLabel[id] || id)}</span>`).join("")}</div></td>
          <td>${escapeHtml(course.source)}</td>
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

document.querySelector("#pageContent").innerHTML = `
  <div class="page-content">
    <div class="page-header">
      <div>
        <p class="eyebrow">Evidence workspace</p>
        <h1>이수 내역까지 한눈에 파악하기</h1>
        <p>GLS 성적 이미지와 챌린지스퀘어 이수내역 이미지를 AI가 읽고, 사용자가 확인한 뒤 졸업요건별 인정내역으로 연결합니다.</p>
      </div>
      <a class="btn btn-secondary" href="requirements.html#evidence">요건별 인정내역 보기</a>
    </div>

    <div class="evidence-summary-grid">
      <div><span>이수 교과목</span><strong>${completedCourses.length}개</strong><small>성적까지 저장됨</small></div>
      <div><span>연결된 교과 학점</span><strong>${recordedCredits}학점</strong><small>현재 등록된 내역 기준</small></div>
      <div><span>비교과 이수</span><strong>${profile.nonCurricular.length}건</strong><small>챌린지스퀘어 내역</small></div>
      <div><span>문서 인식 기록</span><strong>${profile.evidenceImports.length}회</strong><small>GLS·챌린지스퀘어</small></div>
    </div>

    <section class="panel">
      <div class="panel-header"><div><h2>이미지에서 이수내역 가져오기</h2><p>민감정보가 포함된 실제 이미지는 공개 데모가 아닌 로컬 환경에서만 사용하세요.</p></div></div>
      <div class="upload-guide-grid">
        <article>
          <strong>GLS 수강/취득 과목 PDF</strong>
          <span>GLS 접속 → 수강/취득 과목 출력 → 인쇄 → PDF로 저장 → 아래 GLS 영역에 업로드</span>
        </article>
        <article>
          <strong>챌린지스퀘어 비교과 캡처</strong>
          <span>학생성공 가이드 조회 화면을 캡처해 올리면 비교과명, 이수일, 인증영역을 확인할 수 있습니다.</span>
        </article>
        <article>
          <strong>교과 과정 로드맵</strong>
          <span>학과 교과과정 로드맵을 함께 첨부하면 전공·교양·DS 이수 확인에 도움이 됩니다.</span>
        </article>
      </div>
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
          <div class="source-card-title"><span class="source-symbol source-symbol-blue">MAP</span><div><h3>교과 과정 로드맵</h3><p>학과별 이수 흐름과 권장 수강 순서를 참고자료로 첨부합니다.</p></div></div>
          <label class="evidence-upload-zone" for="roadmapFile" data-upload-type="roadmap"><strong>로드맵 이미지 또는 PDF 선택</strong><span>전공 로드맵, 교육과정표, 학과 안내자료</span><input id="roadmapFile" type="file" accept="image/png,image/jpeg,application/pdf" /></label>
          <div class="upload-preview hidden" id="roadmapPreview"></div>
          <div class="source-actions"><button class="btn btn-secondary" type="button" data-sample="roadmap">참고자료로 등록</button></div>
          <div class="alert hidden" id="roadmapStatus"></div>
        </article>
      </div>
      <div class="recognition-flow" aria-label="문서 인식 과정">
        <div><strong>01</strong><span>이미지 등록</span></div><i>→</i>
        <div><strong>02</strong><span>Document Parse</span></div><i>→</i>
        <div><strong>03</strong><span>교과·비교과 구조화</span></div><i>→</i>
        <div><strong>04</strong><span>사용자 검토</span></div><i>→</i>
        <div><strong>05</strong><span>졸업요건 연결</span></div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header"><div><h2>졸업요건별 인정내역 연결 현황</h2><p>현재 프로필에 저장된 교과목과 비교과가 어떤 요건에 반영되는지 보여줍니다.</p></div></div>
      <div class="evidence-requirement-grid">
        ${getRequirementItems(profile).filter((item) => !["registration", "gpa"].includes(item.id)).map(renderRequirementEvidence).join("")}
      </div>
    </section>

    <section class="panel">
      <div class="panel-header"><div><h2>GLS 교과목·성적</h2><p>각 과목이 여러 요건에 동시에 인정되는 경우 연결 태그를 함께 표시합니다.</p></div><span class="badge">${completedCourses.length}과목</span></div>
      <div class="evidence-table-wrap"><table class="course-table evidence-table"><thead><tr><th>수강학기</th><th>학수번호</th><th>교과목명</th><th>학점</th><th>성적</th><th>인정 요건</th><th>출처</th></tr></thead><tbody>${renderCourseRows()}</tbody></table></div>
    </section>

    <section class="panel">
      <div class="panel-header"><div><h2>챌린지스퀘어 비교과 이수</h2><p>최종 이수 상태와 인증영역을 3품 요건에 연결합니다.</p></div><span class="badge">${profile.nonCurricular.length}건</span></div>
      <div class="program-evidence-grid">${renderProgramCards()}</div>
    </section>
  </div>`;

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
