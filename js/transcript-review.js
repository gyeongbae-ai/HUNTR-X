import { getProfile, saveProfile } from "./auth.js";
import { escapeHtml, initAppShell, showToast } from "./common.js";
import { ensureEvidenceData, REQUIREMENT_OPTIONS, STORAGE_KEYS } from "./data.js";

initAppShell({ page: "evidence", title: "이수내역 인식 결과 검토", requireProfile: false });

let parsedDocument;
try {
  parsedDocument = JSON.parse(localStorage.getItem(STORAGE_KEYS.parsedDocument));
} catch {
  parsedDocument = null;
}

if (!parsedDocument?.profileDraft) {
  window.location.replace("evidence.html");
} else {
  const profile = ensureEvidenceData(parsedDocument.profileDraft || getProfile());
  const documentType = parsedDocument.documentType || "gls";
  const isGls = documentType === "gls";
  const extractedText = parsedDocument.extractedText || "추출된 원문 텍스트가 없습니다.";
  const requirementChoices = REQUIREMENT_OPTIONS.filter((item) => !["totalCredits", "poom", "graduationEvaluation"].includes(item.id));

  function primaryRequirement(course) {
    return (course.requirementIds || []).find((id) => !["totalCredits", "internationalTotal", "internationalMajor"].includes(id))
      || (course.requirementIds || []).find((id) => id !== "totalCredits")
      || "primaryMajor";
  }

  function parsePipeRows(text, type) {
    return text
      .split(/\r?\n/)
      .map((line) => line.split(/\s*\|\s*|\t+|\s{2,}/).map((value) => value.trim()))
      .filter((parts) => parts.length >= 4)
      .filter((parts) => !/학수번호|프로그램명/.test(parts.join(" ")))
      .map((parts, index) => type === "gls"
        ? {
            id: `OCR-COURSE-${Date.now()}-${index}`,
            term: parts[0],
            code: parts[1],
            name: parts[2],
            credits: Number(parts[3]) || 3,
            grade: parts[4] || "A0",
            area: "미분류",
            completed: true,
            requirementIds: ["totalCredits", "primaryMajor"],
            source: "GLS 파일 인식",
          }
        : {
            id: `OCR-PROGRAM-${Date.now()}-${index}`,
            title: parts[0],
            organizer: parts[1] || "성균관대학교",
            completedAt: parts[2] || new Date().toISOString().slice(0, 10),
            hours: Number(parts[3]) || 1,
            certificationArea: parts[4] || "인성",
            status: "이수",
            requirementIds: ["poom"],
            source: "챌린지스퀘어 파일 인식",
          });
  }

  function buildCourseItems() {
    const extracted = Array.isArray(parsedDocument.extractedItems) ? parsedDocument.extractedItems : parsePipeRows(extractedText, "gls");
    const fallback = parsedDocument.provider === "Upstage Document Parse"
      ? [{ term: `${profile.admissionYear}-1`, code: "확인 필요", name: "교과목명 확인 필요", credits: 3, grade: "예정", requirementIds: ["totalCredits", "primaryMajor"] }]
      : profile.courses.filter((course) => course.completed).slice(0, 7);
    return (extracted.length ? extracted : fallback).map((item, index) => {
      const existing = profile.courses.find((course) => course.code === item.code) || {};
      return {
        id: item.id || existing.id || `OCR-COURSE-${Date.now()}-${index}`,
        term: item.term || existing.term || `${profile.admissionYear}-1`,
        code: item.code || existing.code || `TEMP${index + 1}`,
        name: item.name || existing.name || "교과목명 확인 필요",
        credits: Number(item.credits || existing.credits || 3),
        grade: item.grade || existing.grade || "A0",
        area: item.area || existing.area || "미분류",
        completed: true,
        requirementIds: item.requirementIds || existing.requirementIds || ["totalCredits", "primaryMajor"],
        source: parsedDocument.provider === "Upstage Document Parse" ? "GLS 파일 인식" : item.source || "GLS 샘플",
      };
    });
  }

  function buildProgramItems() {
    const extracted = Array.isArray(parsedDocument.extractedItems) ? parsedDocument.extractedItems : parsePipeRows(extractedText, "challenge");
    const fallback = parsedDocument.provider === "Upstage Document Parse"
      ? [{ title: "프로그램명 확인 필요", organizer: "운영기관 확인 필요", completedAt: new Date().toISOString().slice(0, 10), hours: 1, certificationArea: "인성" }]
      : profile.nonCurricular.length
        ? profile.nonCurricular
        : [{ title: "프로그램명 확인 필요", organizer: "성균관대학교", completedAt: new Date().toISOString().slice(0, 10), hours: 1, certificationArea: "인성" }];
    return (extracted.length ? extracted : fallback).map((item, index) => ({
      id: item.id || `OCR-PROGRAM-${Date.now()}-${index}`,
      title: item.title || "프로그램명 확인 필요",
      organizer: item.organizer || "성균관대학교",
      completedAt: item.completedAt || new Date().toISOString().slice(0, 10),
      hours: Number(item.hours || 1),
      certificationArea: item.certificationArea || "인성",
      status: item.status || "이수",
      requirementIds: ["poom"],
      source: parsedDocument.provider === "Upstage Document Parse" ? "챌린지스퀘어 파일 인식" : item.source || "챌린지스퀘어 샘플",
    }));
  }

  const items = isGls ? buildCourseItems() : buildProgramItems();

  function renderCourseRows() {
    return items.map((course, index) => `
      <tr data-course-row="${index}">
        <td><input type="checkbox" data-include checked aria-label="${escapeHtml(course.name)} 반영" /></td>
        <td><input class="table-input term-input" data-field="term" value="${escapeHtml(course.term)}" aria-label="수강학기" /></td>
        <td><input class="table-input code-input" data-field="code" value="${escapeHtml(course.code)}" aria-label="학수번호" /></td>
        <td><input class="table-input name-input" data-field="name" value="${escapeHtml(course.name)}" aria-label="교과목명" /></td>
        <td><input class="table-input number-input" data-field="credits" type="number" min="0" max="12" step="0.5" value="${course.credits}" aria-label="학점" /></td>
        <td><select class="table-input grade-input" data-field="grade" aria-label="성적">${["A+", "A0", "B+", "B0", "C+", "C0", "P", "S", "예정"].map((grade) => `<option ${grade === course.grade ? "selected" : ""}>${grade}</option>`).join("")}</select></td>
        <td><select class="table-input requirement-select" data-field="requirement" aria-label="주 인정요건">${requirementChoices.map((option) => `<option value="${option.id}" ${option.id === primaryRequirement(course) ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select></td>
        <td><label class="inline-check"><input type="checkbox" data-field="international" ${(course.requirementIds || []).some((id) => id.startsWith("international")) ? "checked" : ""} /><span>국제어</span></label></td>
      </tr>`).join("");
  }

  function renderProgramRows() {
    return items.map((program, index) => `
      <tr data-program-row="${index}">
        <td><input type="checkbox" data-include checked aria-label="${escapeHtml(program.title)} 반영" /></td>
        <td><input class="table-input name-input" data-field="title" value="${escapeHtml(program.title)}" aria-label="프로그램명" /></td>
        <td><input class="table-input" data-field="organizer" value="${escapeHtml(program.organizer)}" aria-label="운영기관" /></td>
        <td><input class="table-input" data-field="completedAt" type="date" value="${escapeHtml(program.completedAt)}" aria-label="이수일" /></td>
        <td><input class="table-input number-input" data-field="hours" type="number" min="0" max="1000" value="${program.hours}" aria-label="이수시간" /></td>
        <td><select class="table-input" data-field="certificationArea" aria-label="인증영역">${["인성", "글로벌", "창의", "AI", "인턴십"].map((area) => `<option ${area === program.certificationArea ? "selected" : ""}>${area}</option>`).join("")}</select></td>
        <td><select class="table-input" data-field="status" aria-label="이수상태"><option ${program.status === "이수" ? "selected" : ""}>이수</option><option ${program.status === "진행중" ? "selected" : ""}>진행중</option></select></td>
      </tr>`).join("");
  }

  document.querySelector("#pageContent").innerHTML = `
    <div class="page-content">
      <div class="page-header">
        <div>
          <p class="eyebrow">Human in the loop</p>
          <h1>${isGls ? "교과목과 성적을 확인해 주세요" : "비교과 이수내역을 확인해 주세요"}</h1>
          <p>AI 인식 결과는 자동 확정되지 않습니다. 잘못 읽힌 항목을 수정하고 실제로 반영할 행만 선택하세요.</p>
        </div>
        <span class="badge ${parsedDocument.provider === "Upstage Document Parse" ? "badge-success" : "badge-warning"}">${escapeHtml(parsedDocument.provider)}</span>
      </div>

      <div class="recognition-flow recognition-flow-review" aria-label="문서 인식 과정">
        <div class="complete"><strong>01</strong><span>파일 등록</span></div><i>→</i>
        <div class="complete"><strong>02</strong><span>Document Parse</span></div><i>→</i>
        <div class="complete"><strong>03</strong><span>${isGls ? "교과목 구조화" : "비교과 구조화"}</span></div><i>→</i>
        <div class="active"><strong>04</strong><span>사용자 검토</span></div><i>→</i>
        <div><strong>05</strong><span>졸업요건 연결</span></div>
      </div>

      <div class="alert" style="margin-bottom:16px">
        전체를 다시 입력할 필요는 없습니다. Document Parse가 읽은 구조를 바탕으로 과목명, 학점, 인정요건처럼 애매하거나 중요한 칸만 확인해 주세요.
      </div>

      <div class="document-review-grid evidence-review-grid">
        <section class="panel document-source-panel">
          <div class="panel-header"><div><h2>인식한 원본</h2><p>${escapeHtml(parsedDocument.fileName)} · ${new Date(parsedDocument.parsedAt).toLocaleString("ko-KR")}</p></div></div>
          ${parsedDocument.previewDataUrl ? `<img class="document-preview-image" src="${parsedDocument.previewDataUrl}" alt="등록한 파일 미리보기" />` : ""}
          <div class="document-text" tabindex="0">${escapeHtml(extractedText)}</div>
          <p class="field-hint">파일과 구조화 결과를 나란히 비교해 오인식된 글자를 수정하세요.</p>
        </section>

        <section class="panel">
          <div class="panel-header"><div><h2>${isGls ? "추출 교과목·성적" : "추출 비교과 프로그램"}</h2><p>${items.length}개 항목을 찾았습니다. 체크 해제한 행은 저장하지 않습니다.</p></div></div>
          <div class="evidence-table-wrap review-table-wrap">
            <table class="course-table review-table">
              ${isGls
                ? `<thead><tr><th>반영</th><th>수강학기</th><th>학수번호</th><th>교과목명</th><th>학점</th><th>성적</th><th>주 인정요건</th><th>추가</th></tr></thead><tbody>${renderCourseRows()}</tbody>`
                : `<thead><tr><th>반영</th><th>프로그램명</th><th>운영기관</th><th>이수일</th><th>시간</th><th>인증영역</th><th>상태</th></tr></thead><tbody>${renderProgramRows()}</tbody>`}
            </table>
          </div>
          <div class="alert" style="margin-top:16px">${isGls ? "모든 교과목은 총 졸업학점에 포함되며, 선택한 주 인정요건과 국제어수업 여부를 추가로 연결합니다." : "이수 상태인 프로그램은 선택한 인증영역과 3품 요건에 연결됩니다."}</div>
          <div class="form-actions">
            <a class="btn btn-secondary" href="evidence.html">다른 파일 선택</a>
            <button class="btn" id="saveEvidence" type="button">검토 완료하고 요건에 반영</button>
          </div>
        </section>
      </div>
    </div>`;

  function collectCourses() {
    return [...document.querySelectorAll("[data-course-row]")]
      .filter((row) => row.querySelector("[data-include]").checked)
      .map((row) => {
        const sourceItem = items[Number(row.dataset.courseRow)];
        const requirement = row.querySelector('[data-field="requirement"]').value;
        const requirementIds = ["totalCredits", requirement];
        if (requirement === "internationalMajor") requirementIds.push("primaryMajor", "internationalTotal");
        if (row.querySelector('[data-field="international"]').checked) requirementIds.push("internationalTotal", "internationalMajor");
        return {
          id: sourceItem.id,
          term: row.querySelector('[data-field="term"]').value.trim(),
          code: row.querySelector('[data-field="code"]').value.trim(),
          name: row.querySelector('[data-field="name"]').value.trim(),
          credits: Number(row.querySelector('[data-field="credits"]').value),
          grade: row.querySelector('[data-field="grade"]').value,
          area: REQUIREMENT_OPTIONS.find((item) => item.id === requirement)?.label || "미분류",
          completed: true,
          requirementIds: [...new Set(requirementIds)],
          source: parsedDocument.provider === "Upstage Document Parse" ? "GLS 파일 인식" : "GLS 샘플",
        };
      });
  }

  function collectPrograms() {
    return [...document.querySelectorAll("[data-program-row]")]
      .filter((row) => row.querySelector("[data-include]").checked)
      .map((row) => ({
        id: items[Number(row.dataset.programRow)].id,
        title: row.querySelector('[data-field="title"]').value.trim(),
        organizer: row.querySelector('[data-field="organizer"]').value.trim(),
        completedAt: row.querySelector('[data-field="completedAt"]').value,
        hours: Number(row.querySelector('[data-field="hours"]').value),
        certificationArea: row.querySelector('[data-field="certificationArea"]').value,
        status: row.querySelector('[data-field="status"]').value,
        requirementIds: ["poom"],
        source: parsedDocument.provider === "Upstage Document Parse" ? "챌린지스퀘어 파일 인식" : "챌린지스퀘어 샘플",
      }));
  }

  function mergeByKey(current, incoming, key) {
    const map = new Map(current.map((item) => [item[key], item]));
    incoming.forEach((item) => map.set(item[key], item));
    return [...map.values()];
  }

  function updateCreditEvidence(courses) {
    const creditIds = ["totalCredits", "coreGeneral", "balancedGeneral", "dsEducation", "primaryMajor", "secondaryMajor", "internationalTotal", "internationalMajor"];
    creditIds.forEach((id) => {
      if (!profile[id]) return;
      const evidenceCredits = courses.filter((course) => course.requirementIds.includes(id)).reduce((sum, course) => sum + course.credits, 0);
      profile[id].completed = Math.max(Number(profile[id].completed || 0), evidenceCredits);
    });
  }

  document.querySelector("#saveEvidence").addEventListener("click", async () => {
    if (isGls) {
      const courses = collectCourses();
      profile.courses = mergeByKey(profile.courses, courses, "code");
      updateCreditEvidence(profile.courses.filter((course) => course.completed));
    } else {
      const programs = collectPrograms();
      profile.nonCurricular = mergeByKey(profile.nonCurricular, programs, "id");
      profile.poom = profile.poom.map((item) => ({
        ...item,
        completed: item.completed || programs.some((program) => program.status === "이수" && program.certificationArea === item.label),
      }));
    }
    profile.evidenceImports.push({
      id: `IMPORT-${Date.now()}`,
      type: documentType,
      label: parsedDocument.fileName,
      importedAt: new Date().toISOString(),
      itemCount: isGls ? collectCourses().length : collectPrograms().length,
    });
    const saved = await saveProfile(profile);
    if (!saved) {
      showToast("클라우드 저장에 실패했습니다. 검토 결과를 유지한 채 다시 시도해 주세요.");
      return;
    }
    localStorage.removeItem(STORAGE_KEYS.parsedDocument);
    showToast("검토한 이수 내역을 졸업요건에 연결했습니다.");
    window.setTimeout(() => window.location.assign("evidence.html#courses"), 400);
  });
}
