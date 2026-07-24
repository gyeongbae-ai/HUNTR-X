const COURSE_CODE = /^[A-Z]{2,8}\d{3,4}[A-Z]?$/i;
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
  return GRADE.test(grade) ? grade.toUpperCase() : "확인 필요";
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
  const code = text(raw.code).replace(/\s/g, "").toUpperCase();
  if (!COURSE_CODE.test(code)) return null;

  const grade = normalizeGrade(raw.grade);
  const credits = parseCredits(raw.credits);
  const international = isInternational(raw.international);
  const completionType = text(raw.completionType);
  const area = text(raw.area);
  const name = text(raw.name);
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
  if (map.code === undefined || map.name === undefined || map.credits === undefined) return [];
  return rows.slice(headerIndex + 1).map((cells, index) => normalizeRow({
    year: value(cells, map, "year"),
    term: value(cells, map, "term"),
    code: value(cells, map, "code"),
    name: value(cells, map, "name"),
    credits: value(cells, map, "credits"),
    grade: value(cells, map, "grade"),
    completionType: value(cells, map, "completionType"),
    area: value(cells, map, "area"),
    international: value(cells, map, "international"),
  }, index)).filter(Boolean);
}

function rowsFromDelimitedText(source) {
  const rows = [];
  source.split(/\r?\n/).forEach((line, index) => {
    const cells = line.split(/\s*\|\s*|\t+| {2,}/).map(text).filter(Boolean);
    const codeIndex = cells.findIndex((cell) => COURSE_CODE.test(cell.replace(/\s/g, "")));
    if (codeIndex < 0) return;
    const before = cells.slice(0, codeIndex).join(" ");
    const after = cells.slice(codeIndex + 1);
    const gradeIndex = after.findIndex((cell) => GRADE.test(text(cell).replace(/＋/g, "+")));
    const creditIndex = after.findIndex((cell) => /^\d+(?:\.\d+)?$/.test(cell));
    if (creditIndex < 1 || gradeIndex < 0) return;
    const year = before.match(/20\d{2}/)?.[0] || "";
    const term = before.match(/(여름|겨울|[12])\s*학기?/)?.[1] || "";
    const completionType = before.match(/(교양|전공|선택|DS)/)?.[1] || "";
    rows.push(normalizeRow({
      year,
      term,
      code: cells[codeIndex],
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
  const values = [payload?.content?.html, payload?.content?.text, payload?.html, payload?.text, payload?.result?.html, payload?.result?.text];
  if (Array.isArray(payload?.elements)) {
    payload.elements.forEach((element) => values.push(element?.content?.html, element?.content?.text, element?.html, element?.text));
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
