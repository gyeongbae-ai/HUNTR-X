import { getProfile, getSession, saveProfile } from "./auth.js";
import { initAppShell, showToast } from "./common.js";
import { CAMPUSES, clonePersona, COLLEGES, SECONDARY_PROGRAMS, STORAGE_KEYS } from "./data.js";

const existing = getProfile();
const session = getSession();
initAppShell({ page: "onboarding", title: "내 정보 설정", requireProfile: false });

const page = document.querySelector("#pageContent");
page.innerHTML = `
  <div class="page-content">
    <div class="page-header">
      <div>
        <p class="eyebrow">Profile setup</p>
        <h1>${existing ? "내 학업 정보 수정" : "졸업 진단을 시작해볼까요?"}</h1>
        <p>입학연도와 전공 형태에 따라 적용되는 졸업요건이 달라집니다. 현재 상태를 입력하거나 데모 페르소나를 불러오세요.</p>
      </div>
    </div>

    <div class="stepper" aria-label="설정 단계">
      <div class="step active"><span class="step-number">1</span><span>기본정보</span></div>
      <div class="step active"><span class="step-number">2</span><span>전공형태</span></div>
      <div class="step"><span class="step-number">3</span><span>이수현황</span></div>
    </div>

    <section class="panel">
      <div class="panel-header">
        <div><h2>데모 프로필 불러오기</h2><p>복수전공·연계전공·단일전공·조기졸업 케이스를 바로 체험할 수 있습니다.</p></div>
      </div>
      <div class="demo-buttons" style="grid-template-columns: repeat(4, minmax(0, 1fr))">
        <button class="btn btn-secondary" type="button" data-persona="globalBiz">글로벌경영</button>
        <button class="btn btn-secondary" type="button" data-persona="chemSemi">화공 + 융합트랙</button>
        <button class="btn btn-secondary" type="button" data-persona="libEcon">문정 + 경제</button>
        <button class="btn btn-secondary" type="button" data-persona="softwareEarly">SW 조기졸업</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div><h2>학생 정보</h2><p>입력값은 현재 브라우저에만 저장됩니다.</p></div>
      </div>
      <form id="profileForm">
        <div class="form-grid">
          <div class="field">
            <label for="name">이름</label>
            <input id="name" name="name" value="${existing?.name || session?.name || ""}" required />
          </div>
          <div class="field">
            <label for="studentNumber">학번</label>
            <input id="studentNumber" name="studentNumber" inputmode="numeric" value="${existing?.studentNumber || session?.studentNumber || ""}" required />
          </div>
          <div class="field">
            <label for="admissionYear">입학연도</label>
            <select id="admissionYear" name="admissionYear" required>
              ${[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((year) => `<option value="${year}">${year}학번</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="currentSemester">현재 등록학기</label>
            <select id="currentSemester" name="currentSemester">
              ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((semester) => `<option value="${semester}">${semester}학기</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="campus">캠퍼스</label>
            <select id="campus" name="campus">${CAMPUSES.map((campus) => `<option>${campus}</option>`).join("")}</select>
          </div>
          <div class="field">
            <label for="college">단과대학</label>
            <select id="college" name="college"></select>
          </div>
          <div class="field">
            <label for="department">제1전공</label>
            <select id="department" name="department"></select>
          </div>
          <div class="field">
            <label for="degreeType">전공 이수 형태</label>
            <select id="degreeType" name="degreeType">
              <option value="single_major">단일전공·심화트랙</option>
              <option value="double_major">복수전공</option>
              <option value="convergence_track">융합트랙</option>
              <option value="linked_major">연계전공</option>
            </select>
          </div>
          <div class="field form-span-2" id="secondaryField">
            <label for="secondaryProgram">제2전공·연계전공·융합트랙</label>
            <select id="secondaryProgram" name="secondaryProgram">${SECONDARY_PROGRAMS.map((program) => `<option>${program}</option>`).join("")}</select>
          </div>
          <div class="field">
            <label for="gpa">현재 총평점</label>
            <input id="gpa" name="gpa" type="number" min="0" max="4.5" step="0.01" value="${existing?.gpa || 3.5}" />
          </div>
          <div class="field">
            <label for="earlyGraduation">졸업 계획</label>
            <select id="earlyGraduation" name="earlyGraduation">
              <option value="false">일반졸업</option>
              <option value="true">조기졸업 검토</option>
            </select>
          </div>
        </div>

        <div class="panel" style="margin-top: 20px; background: #f8faf9">
          <div class="panel-header">
            <div><h3>GLS 이수내역·성적표 분석</h3><p>PDF나 이미지 파일을 연결하면 Upstage Document Parse가 읽고, 다음 화면에서 추출값을 직접 검토합니다.</p></div>
          </div>
          <div class="upload-zone">
            <strong>성적표 파일 선택</strong>
            <p class="field-hint">PDF, PNG, JPG · 민감정보가 포함된 실제 성적표는 발표용 공개 환경에 업로드하지 마세요.</p>
            <input id="transcriptFile" type="file" accept="application/pdf,image/png,image/jpeg" />
            <button class="btn btn-secondary" id="parseButton" type="button">분석하고 추출값 검토</button>
            <button class="btn btn-ghost" id="sampleParseButton" type="button">샘플 추출 결과 보기</button>
            <div class="alert hidden" id="parseStatus" style="margin-top: 12px"></div>
          </div>
        </div>

        <div class="form-actions">
          <a class="btn btn-secondary" href="dashboard.html">취소</a>
          <button class="btn" type="submit">저장하고 진단하기</button>
        </div>
      </form>
    </section>
    <p class="footer-note">중요: 자동 분석 결과는 참고용입니다. 최종 졸업 가능 여부는 GLS와 학과사무실에서 확인하세요.</p>
  </div>`;

const form = document.querySelector("#profileForm");
const campusSelect = document.querySelector("#campus");
const collegeSelect = document.querySelector("#college");
const departmentSelect = document.querySelector("#department");
const degreeTypeSelect = document.querySelector("#degreeType");
const secondaryField = document.querySelector("#secondaryField");

function fillColleges(selectedCollege, selectedDepartment) {
  const colleges = COLLEGES[campusSelect.value];
  collegeSelect.innerHTML = Object.keys(colleges).map((college) => `<option>${college}</option>`).join("");
  if (selectedCollege && colleges[selectedCollege]) collegeSelect.value = selectedCollege;
  fillDepartments(selectedDepartment);
}

function fillDepartments(selectedDepartment) {
  const departments = COLLEGES[campusSelect.value][collegeSelect.value] || [];
  departmentSelect.innerHTML = departments.map((department) => `<option>${department}</option>`).join("");
  if (selectedDepartment && departments.includes(selectedDepartment)) departmentSelect.value = selectedDepartment;
}

function toggleSecondary() {
  secondaryField.classList.toggle("hidden", degreeTypeSelect.value === "single_major");
}

campusSelect.addEventListener("change", () => fillColleges());
collegeSelect.addEventListener("change", () => fillDepartments());
degreeTypeSelect.addEventListener("change", toggleSecondary);

fillColleges(existing?.college, existing?.department);
document.querySelector("#admissionYear").value = String(existing?.admissionYear || 2024);
document.querySelector("#currentSemester").value = String(existing?.currentSemester || 4);
campusSelect.value = existing?.campus || "인문사회과학캠퍼스";
fillColleges(existing?.college, existing?.department);
degreeTypeSelect.value = existing?.degreeType || "single_major";
document.querySelector("#secondaryProgram").value = existing?.secondaryProgram || "없음";
document.querySelector("#earlyGraduation").value = String(Boolean(existing?.earlyGraduation));
toggleSecondary();

document.querySelectorAll("[data-persona]").forEach((button) => {
  button.addEventListener("click", () => {
    saveProfile(clonePersona(button.dataset.persona));
    showToast("데모 프로필을 불러왔습니다.");
    window.setTimeout(() => window.location.assign("dashboard.html"), 350);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const profile = buildProfileFromForm();
  saveProfile(profile);
  window.location.href = "requirements.html";
});

function getTemplateKey(department) {
  if (department === "화학공학부") return "chemSemi";
  if (department === "문헌정보학과") return "libEcon";
  if (department === "소프트웨어학과") return "softwareEarly";
  return "globalBiz";
}

function getSecondaryRequirement(program) {
  if (program === "경제학과 복수전공") {
    return { completed: 0, required: 39, detail: "전공코어 36학점 + 전공선택 3학점" };
  }
  if (program === "반도체소재부품장비패키징 융합트랙") {
    return { completed: 0, required: 21, detail: "지정과목 21학점 · 원전공과 최대 6학점 인정" };
  }
  return { completed: 0, required: 36, detail: "선택한 전공의 최신 기준 확인 필요" };
}

function buildProfileFromForm() {
  const data = new FormData(form);
  const department = String(data.get("department"));
  const selectedProgram = String(data.get("secondaryProgram"));
  const selectedDegreeType = String(data.get("degreeType"));
  const earlyGraduation = data.get("earlyGraduation") === "true";
  const degreeTypeLabel = degreeTypeSelect.options[degreeTypeSelect.selectedIndex].text;
  const template = clonePersona(getTemplateKey(department));
  const base = existing?.department === department ? existing : template;
  const profile = {
    ...base,
    id: `USER_${data.get("studentNumber")}`,
    name: String(data.get("name")).trim(),
    studentNumber: String(data.get("studentNumber")).trim(),
    admissionYear: Number(data.get("admissionYear")),
    currentSemester: Number(data.get("currentSemester")),
    campus: String(data.get("campus")),
    college: String(data.get("college")),
    department,
    degreeType: selectedDegreeType,
    degreeTypeLabel: earlyGraduation ? `${degreeTypeLabel}·조기졸업` : degreeTypeLabel,
    secondaryProgram: selectedDegreeType === "single_major" ? "없음" : selectedProgram,
    secondaryMajor:
      selectedDegreeType === "single_major"
        ? null
        : base.secondaryProgram === selectedProgram && base.secondaryMajor
          ? base.secondaryMajor
          : getSecondaryRequirement(selectedProgram),
    gpa: Number(data.get("gpa")),
    earlyGraduation,
  };
  profile.totalCredits.required = profile.campus === "자연과학캠퍼스" ? 130 : 120;
  return profile;
}

function extractParsedText(payload) {
  const candidates = [
    payload?.content?.text,
    payload?.content?.html,
    payload?.text,
    payload?.html,
    payload?.result?.text,
    payload?.result?.html,
  ].filter(Boolean);
  const elementText = Array.isArray(payload?.elements)
    ? payload.elements
        .map((element) => element?.content?.text || element?.content?.html || element?.text || "")
        .filter(Boolean)
    : [];
  return [...candidates, ...elementText]
    .join("\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20000);
}

document.querySelector("#sampleParseButton").addEventListener("click", () => {
  const profileDraft = buildProfileFromForm();
  const sampleText = `성균관대학교 학업성적표\n학번 ${profileDraft.studentNumber}\n성명 ${profileDraft.name}\n소속 ${profileDraft.department}\n총 취득학점 ${profileDraft.totalCredits.completed}\n총 평점 ${profileDraft.gpa.toFixed(2)} / 4.50\n전공 취득학점 ${profileDraft.primaryMajor.completed}\n교양 및 기타 이수내역은 우측 검토란에서 확인`; 
  localStorage.setItem(
    STORAGE_KEYS.parsedDocument,
    JSON.stringify({
      fileName: "gradquest-sample-transcript.pdf",
      provider: "Document Parse 샘플",
      parsedAt: new Date().toISOString(),
      extractedText: sampleText,
      profileDraft,
    }),
  );
  window.location.assign("transcript-review.html");
});

document.querySelector("#parseButton").addEventListener("click", async () => {
  const input = document.querySelector("#transcriptFile");
  const status = document.querySelector("#parseStatus");
  if (!input.files.length) {
    status.textContent = "먼저 PDF 또는 이미지 파일을 선택해 주세요.";
    status.className = "alert alert-warning";
    return;
  }

  status.textContent = "문서를 분석하고 있습니다...";
  status.className = "alert";
  const body = new FormData();
  body.append("document", input.files[0]);
  body.append("model", "document-parse");
  body.append("ocr", "force");
  body.append("base64_encoding", "['table']");
  const profileDraft = buildProfileFromForm();

  try {
    const response = await fetch("/api/parse", { method: "POST", body });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || "API unavailable");
    localStorage.setItem(
      STORAGE_KEYS.parsedDocument,
      JSON.stringify({
        fileName: input.files[0].name,
        provider: "Upstage Document Parse",
        parsedAt: new Date().toISOString(),
        extractedText: extractParsedText(payload),
        profileDraft,
      }),
    );
    status.textContent = "문서 분석이 완료되었습니다. 추출값 검토 화면으로 이동합니다.";
    status.className = "alert alert-success";
  } catch {
    localStorage.setItem(
      STORAGE_KEYS.parsedDocument,
      JSON.stringify({
        fileName: input.files[0].name,
        provider: "수동 검토 모드",
        parsedAt: new Date().toISOString(),
        extractedText: "API가 설정되지 않은 정적 환경입니다. 오른쪽 입력값을 성적표와 대조해 수정해 주세요.",
        profileDraft,
      }),
    );
    status.textContent = `${input.files[0].name}을(를) 불러왔습니다. 수동 검토 화면으로 이동합니다.`;
    status.className = "alert alert-warning";
  }
  window.setTimeout(() => window.location.assign("transcript-review.html"), 450);
});
