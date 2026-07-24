const COURSE_CODE = /^[A-Z]{2,8}\d{3,4}[A-Z]?$/i;
const COURSE_CODE_IN_TEXT = /\b([A-Z]{2,8}\d{3,4}[A-Z]?)\b/gi;
const GRADE = /^(A\+|A0|A|B\+|B0|B|C\+|C0|C|D\+|D0|D|F|P|S|U|수강\*?.*|예정)$/i;

function text(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeGrade(value) {
  const grade = text(value).replace(/＋/g, "+");
  if (/수강|예정/.test(grade)) return "예정";
  const match = grade.match(/(?:^|\s)(A\+|A0|A|B\+|B0|B|C\+|C0|C|D\+|D0|D|F|P|S|U)(?:$|\s)/i);
  return match ? match[1].toUpperCase() : GRADE.test(grade) ? grade.toUpperCase() : "확인 필요";
}

function normalizeTerm(year, term) {
  const yearValue = String(year || "").match(/20\d{2}/)?.[0];
  const termValue = text(term);
  if (!yearValue) return termValue || "확인 필요";
  if (/여름/.test(termValue)) return `${yearValue}-여름`;
  if (/겨울/.test(termValue)) return `${yearValue}-겨울`;
  const semester = termValue.match(/[12]/)?.[0];
  return semester ? `${yearValue}-${semester}` : yearValue;
}

function isInternational(value) {
  const normalized = text(value);
  return Boolean(normalized && !/^(없음|미이수|no|n)$/i.test(normalized));
}

function getRequirementIds({ completionType, area, international }) {
  const type = text(completionType);
  const field = text(area);
  const ids = ["totalCredits"];

  if (/^DS|DS교육/.test(type) || /DS/.test(field)) {
    ids.push("dsEducation");
  } else if (/전공/.test(type)) {
    ids.push("primaryMajor");
  } else if (/교양/.test(type)) {
    if (/고전|성균인성|리더십|의사소통|창의|글로벌/.test(field)) ids.push("coreGeneral");
    else if (/인문사회|자연과학|사회\/역사|균형/.test(field)) ids.push("balancedGeneral");
  }

  if (international) {
    ids.push("internationalTotal");
    if (ids.includes("primaryMajor")) ids.push("internationalMajor");
  }
  return [...new Set(ids)];
}

function parseCredits(value) {
  const match = text(value).match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function normalizeRow(raw, index) {
  const code = text(raw.code).match(COURSE_CODE_IN_TEXT)?.[0]?.toUpperCase() || "";
  COURSE_CODE_IN_TEXT.lastIndex = 0;
  if (!COURSE_CODE.test(code)) return null;

  const grade = normalizeGrade(raw.grade);
  const credits = parseCredits(raw.credits);
  const international = isInternational(raw.international);
  const completionType = text(raw.completionType);
  const area = text(raw.area);
  const name = text(raw.name)
    .replace(new RegExp(`^${code}\\s*`, "i"), "")
    .replace(/\s+(?:합계|취득학점)\s*:.*$/i, "")
    .trim();
  if (!name || credits < 0 || credits > 12) return null;

  return {
    id: `GLS-${code}-${index}`,
    term: normalizeTerm(raw.year, raw.term),
    code,
    name,
    credits,
    grade,
    completed: grade !== "예정" && grade !== "F" && grade !== "확인 필요",
    requirementIds: getRequirementIds({ completionType, area, international }),
    completionType,
    area,
    international,
    source: "GLS 파일 인식",
  };
}

function columnMap(headerCells) {
  const map = {};
  headerCells.forEach((cell, index) => {
    const label = text(cell).replace(/\s/g, "");
    if (/학수번호/.test(label)) map.code = index;
    else if (/교과목명|과목명/.test(label)) map.name = index;
    else if (/^년도$/.test(label)) map.year = index;
    else if (/학기/.test(label)) map.term = index;
    else if (/이수구분/.test(label)) map.completionType = index;
    else if (/^영역$/.test(label)) map.area = index;
    else if (/^학점/.test(label)) map.credits = index;
    else if (/성적/.test(label)) map.grade = index;
    else if (/국제어/.test(label)) map.international = index;
  });
  return map;
}

function value(cells, map, key) {
  return map[key] === undefined ? "" : cells[map[key]] || "";
}

function rowsFromHtml(fragment) {
  if (!/<(?:table|tr|td|th)\b/i.test(fragment)) return [];
  const documentNode = new DOMParser().parseFromString(fragment, "text/html");
  const rows = [...documentNode.querySelectorAll("tr")]
    .map((row) => [...row.querySelectorAll("th, td")].map((cell) => text(cell.textContent)))
    .filter((row) => row.length);
  const headerIndex = rows.findIndex((row) => row.some((cell) => /학수번호/.test(cell)));
  if (headerIndex < 0) return [];
  const map = columnMap(rows[headerIndex]);
  if (map.code === undefined || map.credits === undefined || map.grade === undefined) return [];
  if (map.name === undefined) map.name = map.code + 1;
  return rows.slice(headerIndex + 1).map((cells, index) => {
    const joined = cells.join(" | ");
    const codes = [...joined.matchAll(COURSE_CODE_IN_TEXT)].map((match) => match[0]);
    COURSE_CODE_IN_TEXT.lastIndex = 0;
    if (codes.length !== 1) return null;

    const codeIndex = cells.findIndex((cell) => cell.toUpperCase().includes(codes[0].toUpperCase()));
    const codeCell = cells[codeIndex] || "";
    const beforeCode = cells.slice(0, codeIndex + 1).join(" ");
    const inlineName = text(codeCell.slice(codeCell.toUpperCase().indexOf(codes[0].toUpperCase()) + codes[0].length));
    const mappedName = value(cells, map, "name");
    const name = inlineName && !/^(?:\d+(?:\.\d+)?|[12]\s*학기)$/.test(inlineName) ? inlineName : mappedName;
    return normalizeRow({
      year: value(cells, map, "year") || beforeCode,
      term: value(cells, map, "term") || beforeCode,
      code: codes[0],
      name,
      credits: value(cells, map, "credits"),
      grade: value(cells, map, "grade"),
      completionType: value(cells, map, "completionType"),
      area: value(cells, map, "area"),
      international: value(cells, map, "international"),
    }, index);
  }).filter(Boolean);
}

function rowsFromDelimitedText(source) {
  const rows = [];
  source.split(/\r?\n/).forEach((line, index) => {
    const cells = line.split(/\s*\|\s*|\t+| {2,}/).map(text).filter(Boolean);
    const lineCodes = [...line.matchAll(COURSE_CODE_IN_TEXT)].map((match) => match[0]);
    COURSE_CODE_IN_TEXT.lastIndex = 0;
    if (lineCodes.length !== 1) return;
    const codeIndex = cells.findIndex((cell) => cell.toUpperCase().includes(lineCodes[0].toUpperCase()));
    if (codeIndex < 0) return;
    const before = cells.slice(0, codeIndex).join(" ");
    const codeCell = cells[codeIndex];
    const inlineName = text(codeCell.slice(codeCell.toUpperCase().indexOf(lineCodes[0].toUpperCase()) + lineCodes[0].length));
    const after = [...(inlineName ? [inlineName] : []), ...cells.slice(codeIndex + 1)];
    const gradeIndex = after.findIndex((cell) => GRADE.test(text(cell).replace(/＋/g, "+")));
    const creditIndex = after.findIndex((cell) => /^\d+(?:\.\d+)?$/.test(cell));
    if (creditIndex < 1 || gradeIndex < 0) return;
    const year = before.match(/20\d{2}/)?.[0] || "";
    const term = before.match(/(여름|겨울|[12])\s*학기?/)?.[1] || "";
    const completionType = before.match(/(교양|전공|선택|DS)/)?.[1] || "";
    rows.push(normalizeRow({
      year,
      term,
      code: lineCodes[0],
      name: after.slice(0, creditIndex).join(" "),
      credits: after[creditIndex],
      grade: after[gradeIndex],
      completionType,
      area: "",
      international: after.slice(gradeIndex + 1).join(" "),
    }, index));
  });
  return rows.filter(Boolean);
}

function payloadFragments(payload) {
  const values = [payload?.content?.html, payload?.content?.markdown, payload?.content?.text, payload?.html, payload?.text, payload?.result?.html, payload?.result?.text];
  if (Array.isArray(payload?.elements)) {
    payload.elements.forEach((element) => values.push(element?.content?.html, element?.content?.markdown, element?.content?.text, element?.html, element?.text));
  }
  return values.filter(Boolean).map(String);
}

export function parseGlsCourseDocument(payload) {
  const fragments = payloadFragments(payload);
  const tableRows = fragments.flatMap(rowsFromHtml);
  const rows = tableRows.length ? tableRows : fragments.flatMap(rowsFromDelimitedText);
  const deduped = new Map();
  rows.forEach((row) => {
    if (!row) return;
    const key = `${row.term}:${row.code}`;
    const previous = deduped.get(key);
    if (!previous || Object.values(row).filter(Boolean).length > Object.values(previous).filter(Boolean).length) deduped.set(key, row);
  });
  return [...deduped.values()];
}

export function normalizeStructuredGlsCourses(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row, index) => normalizeRow(row, `SOLAR-${index}`)).filter(Boolean);
}

export function getGlsExtractedText(payload) {
  return payloadFragments(payload)
    .map((fragment) => {
      if (!/<[a-z][\s\S]*>/i.test(fragment)) return fragment;
      const documentNode = new DOMParser().parseFromString(fragment, "text/html");
      return [...documentNode.querySelectorAll("tr")]
        .map((row) => [...row.querySelectorAll("th, td")].map((cell) => text(cell.textContent)).filter(Boolean).join(" | "))
        .filter(Boolean)
        .join("\n") || text(documentNode.body.textContent);
    })
    .filter(Boolean)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 30000);
}

export function mergeGlsCourses(rows) {
  const merged = new Map();
  rows.flat().filter(Boolean).forEach((row) => {
    const key = `${row.term}:${row.code}`;
    if (!merged.has(key)) merged.set(key, row);
  });
  return [...merged.values()];
}

function challengeArea(fileName, source) {
  const value = `${fileName || ""} ${source || ""}`;
  if (/인턴/.test(value)) return "인턴십";
  if (/AI\s*인증|AI\s*교육|\bAI\b/.test(value)) return "AI";
  if (/글로벌|국제/.test(value)) return "글로벌";
  if (/인성|사회봉사/.test(value)) return "인성";
  if (/창의|역량구분/.test(value)) return "창의";
  return "확인 필요";
}

export function normalizeStructuredChallengePrograms(rows, fileName = "", source = "") {
  if (!Array.isArray(rows)) return [];
  const fallbackArea = challengeArea(fileName, source);
  return rows.map((row, index) => {
    const title = text(row?.title);
    const organizer = text(row?.organizer) || "성균관대학교";
    const completedAt = text(row?.completedAt);
    const hours = parseCredits(row?.hours);
    const certificationArea = ["인성", "글로벌", "창의", "AI", "인턴십"].includes(text(row?.certificationArea))
      ? text(row.certificationArea)
      : fallbackArea;
    if (!title || !/^20\d{2}-\d{2}-\d{2}$/.test(completedAt) || hours <= 0 || certificationArea === "확인 필요") return null;
    return {
      id: `CS-SOLAR-${completedAt}-${index}-${title}`,
      title,
      organizer,
      completedAt,
      hours,
      certificationArea,
      status: "이수",
      completed: true,
      requirementIds: ["poom"],
      source: "챌린지스퀘어 파일 인식",
    };
  }).filter(Boolean);
}

export function parseChallengePrograms(payload, fileName = "") {
  const fragments = payloadFragments(payload);
  const area = challengeArea(fileName, fragments.join(" "));
  const programs = [];
  fragments.forEach((fragment) => {
    if (!/<(?:table|tr|td|th)\b/i.test(fragment)) return;
    const documentNode = new DOMParser().parseFromString(fragment, "text/html");
    [...documentNode.querySelectorAll("table")].forEach((table) => {
      const rows = [...table.querySelectorAll("tr")].map((row) => [...row.querySelectorAll("th, td")].map((cell) => text(cell.textContent))).filter((row) => row.length);
      const headerIndex = rows.findIndex((row) => row.some((cell) => /프로그램명|봉사시간|이수시간/.test(cell)));
      if (headerIndex < 0) return;
      const headers = rows[headerIndex];
      const programIndex = headers.findIndex((cell) => /프로그램명|봉사유형|과목명/.test(cell));
      const hoursIndex = headers.findIndex((cell) => /봉사시간|이수시간|학점/.test(cell));
      const yearIndex = headers.findIndex((cell) => /이수년도|학년도|제출학년도/.test(cell));
      const termIndex = headers.findIndex((cell) => /학기/.test(cell));
      const organizerIndex = headers.findIndex((cell) => /주관부서|운영기관|기관/.test(cell));
      if (hoursIndex < 0 || (programIndex < 0 && organizerIndex < 0)) return;
      rows.slice(headerIndex + 1).forEach((cells, index) => {
        const hours = parseCredits(cells[hoursIndex]);
        const title = text(cells[programIndex]) || text(cells[organizerIndex]);
        if (!title || hours <= 0) return;
        const year = text(cells[yearIndex]).match(/20\d{2}/)?.[0] || "";
        const term = text(cells[termIndex]).match(/[12]/)?.[0] || "";
        programs.push({
          id: `CS-${area}-${year}-${index}-${title}`,
          title,
          organizer: text(cells[organizerIndex]) || "챌린지스퀘어",
          completedAt: year ? `${year}-${term === "2" ? "12" : "06"}-01` : "",
          hours,
          certificationArea: area,
          status: "확인 필요",
          completed: false,
          source: "챌린지스퀘어 파일 인식",
        });
      });
    });
  });
  const deduped = new Map();
  programs.forEach((program) => deduped.set(`${program.certificationArea}:${program.title}:${program.hours}`, program));
  return [...deduped.values()];
}
