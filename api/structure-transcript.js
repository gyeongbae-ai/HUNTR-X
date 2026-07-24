const UPSTAGE_CHAT_URL = process.env.UPSTAGE_CHAT_URL || "https://api.upstage.ai/v1/chat/completions";
const UPSTAGE_CHAT_MODEL = process.env.UPSTAGE_CHAT_MODEL || "solar-pro3";

const COURSE_CODE = /^[A-Z]{2,8}\d{3,4}[A-Z]?$/;
const GRADES = new Set(["A+", "A0", "A", "B+", "B0", "B", "C+", "C0", "C", "D+", "D0", "D", "F", "P", "S", "U", "예정"]);
const CERTIFICATION_AREAS = new Set(["인성", "글로벌", "창의", "AI", "인턴십"]);

function extractJson(value) {
  const source = String(value || "").replace(/^```(?:json)?\s*|\s*```$/gi, "").trim();
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(source.slice(start, end + 1));
  } catch {
    return null;
  }
}

function cleanCourse(row) {
  const code = String(row?.code || "").replace(/\s/g, "").toUpperCase();
  const year = String(row?.year || "").match(/20\d{2}/)?.[0] || "";
  const term = String(row?.term || "").match(/여름|겨울|[12]/)?.[0] || "";
  const name = String(row?.name || "").replace(/\s+/g, " ").trim();
  const credits = Number(row?.credits);
  const rawGrade = String(row?.grade || "").replace(/＋/g, "+").trim().toUpperCase();
  const grade = /수강|예정/.test(String(row?.grade || "")) ? "예정" : rawGrade;
  if (!COURSE_CODE.test(code) || !year || !term || !name || !Number.isFinite(credits) || credits < 0 || credits > 12 || !GRADES.has(grade)) return null;
  return {
    year,
    term,
    code,
    name,
    credits,
    grade,
    completionType: String(row?.completionType || "").trim(),
    area: String(row?.area || "").trim(),
    international: Boolean(row?.international),
  };
}

function cleanProgram(row, fallbackArea) {
  const title = String(row?.title || "").replace(/\s+/g, " ").trim();
  const organizer = String(row?.organizer || "성균관대학교").replace(/\s+/g, " ").trim();
  const year = String(row?.year || row?.completedAt || "").match(/20\d{2}/)?.[0] || "";
  const term = String(row?.term || "").match(/[12]/)?.[0] || "";
  const rawDate = String(row?.completedAt || "").trim();
  const completedAt = /^20\d{2}-\d{2}-\d{2}$/.test(rawDate)
    ? rawDate
    : year ? `${year}-${term === "2" ? "12-31" : "06-30"}` : "";
  const hours = Number(row?.hours);
  const certificationArea = CERTIFICATION_AREAS.has(String(row?.certificationArea || ""))
    ? String(row.certificationArea)
    : fallbackArea;
  if (!title || /조회된 데이터가 없습니다|프로그램명 확인 필요/.test(title) || !completedAt || !Number.isFinite(hours) || hours <= 0 || hours > 2000) return null;
  return {
    title,
    organizer,
    completedAt,
    hours,
    certificationArea,
    status: "이수",
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.UPSTAGE_API_KEY) return res.status(503).json({ error: "UPSTAGE_API_KEY is not configured" });

  const rawText = String(req.body?.rawText || "").slice(0, 30000);
  const documentType = req.body?.documentType === "challenge" ? "challenge" : "gls";
  const fallbackArea = CERTIFICATION_AREAS.has(req.body?.certificationArea) ? req.body.certificationArea : "인성";
  if (!rawText) return res.status(400).json({ error: "Parsed document text is required" });

  const system = documentType === "gls" ? `성균관대학교 GLS 수강·취득 과목 표를 JSON으로 구조화하는 데이터 추출기입니다.
반드시 입력에 실제로 나타난 교과목만 반환하고, 누락값을 추측하거나 새 교과목을 만들지 마세요.
OCR 때문에 인접 행이 합쳐져도 학수번호를 기준으로 각 교과목을 분리하세요.
각 항목은 year(4자리), term(1, 2, 여름, 겨울), code(영문+숫자 학수번호), name, credits(숫자), grade를 가져야 합니다.
수강*(2학기)처럼 아직 수강 중인 성적은 grade를 "예정"으로 반환하세요.
completionType은 교양/전공/DS/선택 등 이수구분, area는 고전·명저/전공코어/DS기반(공통) 등 영역입니다.
국제어 또는 (Y)가 명확한 과목만 international을 true로 지정하세요.
설명 없이 {"courses": [...]} JSON 하나만 반환하세요.` : `성균관대학교 챌린지스퀘어 비교과 이수 화면을 JSON으로 구조화하는 데이터 추출기입니다.
입력에 실제 이수 행으로 표시된 프로그램만 반환하고, 화면 제목이나 인증현황 요약을 프로그램으로 만들지 마세요.
"조회된 데이터가 없습니다"인 표는 빈 배열로 두세요. 교과 표에 있는 과목은 비교과 프로그램에 포함하지 마세요.
각 항목은 title(프로그램명), organizer(주관부서 또는 운영기관), year(이수년도), term(학기), completedAt(명확한 날짜가 있을 때 YYYY-MM-DD), hours(이수시간), certificationArea를 가집니다.
인증영역은 인성, 글로벌, 창의, AI, 인턴십 중 하나입니다. 파일 문맥의 기본 인증영역은 ${fallbackArea}입니다.
화면 유형별로 다음 기준을 반드시 적용하세요.
- AI 인증: "비교과" 표의 프로그램명과 이수시간만 AI 항목으로 추출하고 위쪽 "교과" 과목은 제외합니다.
- 창의 인증: 이수년도·역량구분·프로그램명·주관부서·이수시간 행을 각각 창의 항목으로 추출합니다.
- 인성 인증: 사회봉사영역 행은 "기관 - 봉사유형"을 title로, 기관을 organizer로, 봉사시간을 hours로 추출합니다.
- 인턴십 인증: "비교과" 표에 프로그램 행이 있을 때만 추출합니다. 교과 과목과 왼쪽 취득현황 합계는 제외합니다.
- 글로벌 인증: "글로벌 체험학습 프로그램" 표의 실제 행만 추출하고 국제어수업 교과목은 제외합니다.
설명 없이 {"programs": [...]} JSON 하나만 반환하세요.`;

  try {
    const response = await fetch(UPSTAGE_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSTAGE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: UPSTAGE_CHAT_MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: rawText },
        ],
        temperature: 0,
        max_tokens: 8000,
      }),
    });
    const payload = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: payload?.error?.message || "Upstage API request failed" });

    const parsed = extractJson(payload?.choices?.[0]?.message?.content);
    if (documentType === "challenge") {
      const programs = (parsed?.programs || []).map((row) => cleanProgram(row, fallbackArea)).filter(Boolean);
      const deduped = new Map(programs.map((program) => [`${program.certificationArea}:${program.completedAt}:${program.title}`, program]));
      return res.status(200).json({ programs: [...deduped.values()] });
    }

    const courses = (parsed?.courses || []).map(cleanCourse).filter(Boolean);
    if (!courses.length) return res.status(422).json({ error: "No validated courses were structured" });
    const deduped = new Map(courses.map((course) => [`${course.year}-${course.term}:${course.code}`, course]));
    return res.status(200).json({ courses: [...deduped.values()] });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error" });
  }
}
