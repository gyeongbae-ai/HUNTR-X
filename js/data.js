export const STORAGE_KEYS = {
  users: "gradquest_users",
  session: "gradquest_session",
  profile: "gradquest_profile",
  parsedDocument: "gradquest_parsed_document",
};

export const REQUIREMENT_OPTIONS = [
  { id: "totalCredits", label: "총 졸업학점" },
  { id: "coreGeneral", label: "중점교양" },
  { id: "balancedGeneral", label: "균형교양" },
  { id: "dsEducation", label: "DS 교육과정" },
  { id: "primaryMajor", label: "제1전공" },
  { id: "secondaryMajor", label: "제2전공·연계·융합" },
  { id: "internationalTotal", label: "국제어수업 전체" },
  { id: "internationalMajor", label: "전공 국제어수업" },
  { id: "poom", label: "3품 인증" },
  { id: "graduationEvaluation", label: "졸업평가" },
];

export const CAMPUSES = ["인문사회과학캠퍼스", "자연과학캠퍼스"];

export const COLLEGES = {
  인문사회과학캠퍼스: {
    문과대학: ["문헌정보학과"],
    경제대학: ["경제학과"],
    사회과학대학: ["미디어커뮤니케이션학과"],
    예술대학: ["디자인학과"],
    사범대학: ["교육학과"],
    경영대학: ["글로벌경영학과"],
  },
  자연과학캠퍼스: {
    공과대학: ["화학공학부"],
    자연과학대학: ["화학과"],
    약학대학: ["약학과"],
    소프트웨어융합대학: ["소프트웨어학과"],
  },
};

export const SECONDARY_PROGRAMS = [
  "없음",
  "경제학과 복수전공",
  "미디어커뮤니케이션학과 복수전공",
  "지능형 실감미디어와 지역문화 콘텐츠 마이크로디그리",
  "반도체소재부품장비패키징 융합트랙",
  "반도체소부장인공지능시스템연계전공",
  "차세대반도체공학 연계전공",
];

export const OFFICIAL_SOURCES = [
  {
    label: "성균관대학교 2026 학사제도 안내",
    url: "https://ibook.skku.edu/Viewer/2026skku",
  },
  {
    label: "성균관대학교 학사제도",
    url: "https://www.skku.edu/skku/edu/bachelor/ca_de_schedule01.do",
  },
  {
    label: "성균관대학교 학칙",
    url: "https://rules.skku.edu/",
  },
  {
    label: "학과별 전공학점 이수기준표",
    url: "https://www.skku.edu/_res/skku/etc/y220218.pdf",
  },
  {
    label: "반도체소재부품장비패키징 융합트랙 교과목 구성",
    url: "https://ssu.skku.edu/index.php?mp=2_4_2",
  },
  {
    label: "성균관대학교 비교과 프로그램 공지",
    url: "https://www.skku.edu/skku/campus/skk_comm/notice07.do",
  },
  {
    label: "소프트웨어학과 학사과정 졸업요건",
    url: "https://professor.skku.edu/cse/dept_require.do",
  },
  {
    label: "소프트웨어학과 지정 DS 교과목 안내",
    url: "https://professor.skku.edu/swuniv/axConvergenceEdu_swConvergence.do",
  },
  {
    label: "비전공자 DS 교육 학번별 기준",
    url: "https://skb.skku.edu/swuniv/SW-AI-DS.do",
  },
  {
    label: "성균관대학교 전공 로드맵",
    url: "https://ibook.skku.edu/Viewer/OCFDOM5VH4A2",
  },
  {
    label: "화학공학부 교과과정",
    url: "https://cheme.skku.edu/undergraduate-course-offerings/",
  },
  {
    label: "경제학과 교육과정",
    url: "https://professor.skku.edu/ecostat/under_econ_curriculum.do",
  },
  {
    label: "미디어커뮤니케이션학과 주요규정",
    url: "https://mediacomm.skku.edu/mediacomm/rule/rule_under.do",
  },
  {
    label: "HUSS 마이크로디그리 교과목",
    url: "https://huss.skku.edu/subject",
  },
  {
    label: "디자인학과 교육과정",
    url: "https://design.skku.edu/design/dept_curriculum.do",
  },
  {
    label: "화학과 교육과정",
    url: "https://skb.skku.edu/cscience/undergraduate/chem_curiculum.do?lang=Korean",
  },
  {
    label: "약학대학 학사 졸업규정",
    url: "https://pharm.skku.edu/academics/degree02.php",
  },
  {
    label: "사범대학 교직 기본이수과목",
    url: "https://coe.skku.edu/coe/union/basic.do?articleNo=30578&attachNo=138103&mode=download",
  },
  {
    label: "소프트웨어학과 교육과정",
    url: "https://skb.skku.edu/sw/under_sw_curriculum.do",
  },
];

const sharedPoom = [
  { id: "character", label: "인성", completed: true },
  { id: "global", label: "글로벌", completed: true },
  { id: "creativity", label: "창의", completed: false },
  { id: "ai", label: "AI", completed: false },
  { id: "internship", label: "인턴십", completed: false },
];

const LEGACY_PERSONAS = {
  chemSemi: {
    id: "TEST_P01_CHEM_SEMI",
    name: "김화공",
    studentNumber: "2024123456",
    admissionYear: 2024,
    campus: "자연과학캠퍼스",
    college: "공과대학",
    department: "화학공학부",
    degreeType: "convergence_track",
    degreeTypeLabel: "융합트랙 이수",
    secondaryProgram: "반도체소재부품장비패키징 융합트랙",
    earlyGraduation: false,
    currentSemester: 5,
    gpa: 3.68,
    totalCredits: { completed: 78, required: 130 },
    coreGeneral: { completed: 14, required: 16 },
    balancedGeneral: { completed: 6, required: 6 },
    dsEducation: { completed: 3, required: 6 },
    primaryMajor: { completed: 28, required: 40, detail: "전공코어 24학점 + 전공심화 12학점 + 실험실습 4학점" },
    secondaryMajor: { completed: 12, required: 21, detail: "지정과목 21학점 · 원전공과 최대 6학점 인정 · 산학프로젝트 또는 인턴십 권장" },
    creditBreakdown: {
      primaryMajor: [
        { label: "전공코어", completed: 18, required: 24 },
        { label: "전공심화", completed: 6, required: 12 },
        { label: "실험실습", completed: 4, required: 4 },
      ],
      secondaryMajor: [
        { label: "반도체 공통·기초", completed: 9, required: 12 },
        { label: "공정·소재·패키징 심화", completed: 3, required: 9 },
      ],
    },
    internationalTotal: { completed: 9, required: 18 },
    internationalMajor: { completed: 6, required: 12 },
    poom: sharedPoom.map((item) => ({ ...item })),
    graduationEvaluation: {
      completed: 1,
      required: 3,
      label: "화학공학부 졸업평가",
      description: "화공기사·URP·내부인턴십·외부인턴십 중 한 경로를 선택하고, 필요 시 포스터 심사를 통과해야 합니다.",
      checklist: [
        { label: "평가 경로 선택", completed: true },
        { label: "90시간 이상 연구·인턴 활동", completed: false },
        { label: "포스터 발표 및 최종 합격", completed: false },
      ],
    },
    courses: [
      { code: "ECH2005", name: "화공열역학1", area: "전공코어", credits: 3, completed: true },
      { code: "ECH2007", name: "화공유체역학", area: "전공코어", credits: 3, completed: true },
      { code: "ECH2031", name: "화공계산", area: "전공코어", credits: 3, completed: true },
      { code: "ECH3024", name: "화학공학실험1", area: "실험실습", credits: 2, completed: true },
      { code: "ECH3025", name: "화학공학실험2", area: "실험실습", credits: 2, completed: true },
      { code: "SCM3001", name: "반도체종합설비기술", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: true, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "SSE2018", name: "반도체소자", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: true, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "SSE3036", name: "반도체공정", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: true, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECH3061", name: "반도체화학공정", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: true, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECH3016", name: "분리공정", area: "전공코어", credits: 3, completed: false },
      { code: "ECH3053", name: "반응공학", area: "전공코어", credits: 3, completed: false },
      { code: "ECH3073", name: "화공종합설계", area: "전공심화", credits: 3, completed: false },
      { code: "EAM2057", name: "신소재공학 개론1", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: false, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "EAM4019", name: "전자 패키지공학", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: false, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECH2032", name: "화공열및물질전달", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: false, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECH4017", name: "플라즈마공정및응용", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: false, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ASE3002", name: "반도체제품개론", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: false, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ASE3003", name: "진공및플라즈마", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: false, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
    ],
    notes: [
      "ABEEK 이수자는 MSC 21학점 기준을 별도로 확인해야 합니다.",
      "융합트랙은 졸업학기까지 21학점을 모두 이수해야 하며 차세대반도체공학연계전공과 중복 이수할 수 없습니다.",
      "학과별 입학연도 기준표와 최종 대조가 필요합니다.",
    ],
  },
  libEcon: {
    id: "TEST_P02_LIB_ECON",
    name: "이문정",
    studentNumber: "2023123456",
    admissionYear: 2023,
    campus: "인문사회과학캠퍼스",
    college: "문과대학",
    department: "문헌정보학과",
    degreeType: "double_major",
    degreeTypeLabel: "복수전공",
    secondaryProgram: "경제학과 복수전공",
    earlyGraduation: false,
    currentSemester: 6,
    gpa: 3.74,
    totalCredits: { completed: 91, required: 120 },
    coreGeneral: { completed: 18, required: 18 },
    balancedGeneral: { completed: 6, required: 6 },
    dsEducation: { completed: 6, required: 6 },
    primaryMajor: { completed: 30, required: 42, detail: "복수전공 감면 기준" },
    secondaryMajor: { completed: 24, required: 39, detail: "전공코어 36학점 + 전공선택 3학점" },
    creditBreakdown: {
      primaryMajor: [
        { label: "전공코어", completed: 24, required: 30 },
        { label: "전공심화", completed: 6, required: 12 },
      ],
      secondaryMajor: [
        { label: "경제학 전공코어", completed: 24, required: 36 },
        { label: "경제학 전공선택", completed: 0, required: 3 },
      ],
    },
    internationalTotal: { completed: 9, required: 18 },
    internationalMajor: { completed: 6, required: 12 },
    poom: sharedPoom.map((item, index) => ({ ...item, completed: index < 3 })),
    graduationEvaluation: {
      completed: 1,
      required: 6,
      label: "두 전공 졸업평가",
      description: "문헌정보학과 졸업논문과 경제학과 졸업시험을 모두 확인해야 합니다. 시험의 세부 합격·면제 기준은 최신 내규 확인 전 확정하지 않습니다.",
      checklist: [
        { label: "문헌정보학과 지도교수 배정", completed: true },
        { label: "문헌정보학과 졸업논문 제출", completed: false },
        { label: "문헌정보학과 논문 심사 합격", completed: false },
        { label: "경제학과 졸업시험 대상 확인", completed: false },
        { label: "경제학과 최신 응시·합격 기준 확인", completed: false },
        { label: "제1·제2전공 최종 승인", completed: false },
      ],
    },
    courses: [
      { code: "LIS2001", name: "문헌정보학개론", area: "제1전공", credits: 3, completed: true },
      { code: "LIS2005", name: "정보학개론", area: "제1전공", credits: 3, completed: true },
      { code: "LIS2015", name: "메타데이터론", area: "제1전공", credits: 3, completed: false },
      { code: "ECO2001", name: "경제학원론1", area: "경제학과 복수전공", credits: 3, completed: true, source: "성균관대 전공학점 이수기준표·GLS 수강편람 대조", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECO2002", name: "경제학원론2", area: "경제학과 복수전공", credits: 3, completed: true, source: "성균관대 전공학점 이수기준표·GLS 수강편람 대조", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECO2003", name: "미시경제학", area: "경제학과 복수전공", credits: 3, completed: true, source: "성균관대 전공학점 이수기준표·GLS 수강편람 대조", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECO2004", name: "거시경제학", area: "경제학과 복수전공", credits: 3, completed: true, source: "성균관대 전공학점 이수기준표·GLS 수강편람 대조", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECO3001", name: "계량경제학", area: "경제학과 복수전공", credits: 3, completed: true, source: "성균관대 전공학점 이수기준표·GLS 수강편람 대조", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECO3002", name: "게임이론", area: "경제학과 복수전공", credits: 3, completed: true, source: "성균관대 전공학점 이수기준표·GLS 수강편람 대조", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECO3003", name: "국제경제학", area: "경제학과 복수전공", credits: 3, completed: true, source: "성균관대 전공학점 이수기준표·GLS 수강편람 대조", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECO3004", name: "화폐금융론", area: "경제학과 복수전공", credits: 3, completed: true, source: "성균관대 전공학점 이수기준표·GLS 수강편람 대조", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECO3005", name: "재정학", area: "경제학과 복수전공", credits: 3, completed: false, source: "성균관대 전공학점 이수기준표·GLS 수강편람 대조", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECO3006", name: "산업조직론", area: "경제학과 복수전공", credits: 3, completed: false, source: "성균관대 전공학점 이수기준표·GLS 수강편람 대조", requirementIds: ["totalCredits", "secondaryMajor"] },
    ],
    notes: ["복수전공자는 두 전공의 졸업평가를 모두 통과해야 합니다.", "경제학과 시험 시행은 확인됐지만 세부 합격·면제 기준은 최신 학과 내규와 다시 대조해야 합니다."],
  },
  globalBiz: {
    id: "TEST_P03_GLB_BIZ",
    name: "박글경",
    studentNumber: "2024123457",
    admissionYear: 2024,
    campus: "인문사회과학캠퍼스",
    college: "경영대학",
    department: "글로벌경영학과",
    degreeType: "single_major",
    degreeTypeLabel: "단일전공·심화트랙",
    secondaryProgram: "없음",
    earlyGraduation: false,
    currentSemester: 5,
    gpa: 3.86,
    totalCredits: { completed: 84, required: 120 },
    coreGeneral: { completed: 16, required: 16 },
    balancedGeneral: { completed: 6, required: 6 },
    dsEducation: { completed: 6, required: 6 },
    primaryMajor: { completed: 36, required: 54, detail: "전공코어 39학점 + 전공선택 15학점" },
    secondaryMajor: null,
    creditBreakdown: {
      primaryMajor: [
        { label: "전공코어", completed: 30, required: 39 },
        { label: "전공심화", completed: 6, required: 15 },
      ],
    },
    internationalTotal: { completed: 15, required: 18 },
    internationalMajor: { completed: 9, required: 12 },
    poom: sharedPoom.map((item, index) => ({ ...item, completed: index < 2 })),
    graduationEvaluation: {
      completed: 2,
      required: 3,
      label: "글로벌경영학과 졸업평가",
      description: "전용 필수교양, I-Core 4과목 패키지, 글로벌 활동을 모두 이수해야 합니다.",
      checklist: [
        { label: "전용 필수교양 이수", completed: true },
        { label: "3학년 1학기 I-Core 4과목 동시 이수", completed: true },
        { label: "교환학생·해외인턴십 등 글로벌 활동", completed: false },
      ],
    },
    courses: [
      { code: "GBA1001", name: "Introduction to Financial Accounting", area: "전공코어", credits: 3, completed: true },
      { code: "GBA2005", name: "Financial Management", area: "전공코어", credits: 3, completed: true },
      { code: "GBA3001", name: "Intermediate Corporate Finance", area: "I-Core", credits: 3, completed: true },
      { code: "GBA3011", name: "Marketing Strategy and Planning", area: "I-Core", credits: 3, completed: true },
      { code: "GBA3021", name: "Strategic Management", area: "I-Core", credits: 3, completed: true },
      { code: "GBA3031", name: "Operations Management", area: "I-Core", credits: 3, completed: true },
    ],
    notes: ["I-Core 과목은 패키지 동시 수강 조건을 확인해야 합니다.", "글로벌 활동 인정 범위는 학과 공지와 최종 대조가 필요합니다."],
  },
  softwareEarly: {
    id: "TEST_P04_SW_EARLY",
    name: "최소연",
    studentNumber: "2020123456",
    admissionYear: 2020,
    campus: "자연과학캠퍼스",
    college: "소프트웨어융합대학",
    department: "소프트웨어학과",
    degreeType: "single_major",
    degreeTypeLabel: "단일전공·조기졸업",
    secondaryProgram: "없음",
    earlyGraduation: true,
    currentSemester: 6,
    gpa: 4.08,
    totalCredits: { completed: 122, required: 130 },
    coreGeneral: { completed: 18, required: 18 },
    balancedGeneral: { completed: 6, required: 6 },
    dsEducation: {
      completed: 6,
      required: 6,
      exception: true,
      exceptionLabel: "소프트웨어학과 지정 DS 과목 적용",
      detail: "DASF003 공학컴퓨터프로그래밍 + DASF004 프로그래밍기초와실습",
      courseCodes: ["DASF003", "DASF004"],
    },
    primaryMajor: { completed: 60, required: 66, detail: "소프트웨어학과 단일전공 기준 · 조기졸업도 감면 없음" },
    secondaryMajor: null,
    creditBreakdown: {
      primaryMajor: [
        { label: "전공코어", completed: 36, required: 36 },
        { label: "전공심화", completed: 18, required: 24 },
        { label: "실험실습", completed: 6, required: 6 },
      ],
    },
    internationalTotal: { completed: 18, required: 18 },
    internationalMajor: { completed: 12, required: 12 },
    poom: sharedPoom.map((item, index) => ({ ...item, completed: index < 3 })),
    graduationEvaluation: {
      completed: 2,
      required: 4,
      label: "소프트웨어학과 연구·인턴십 졸업평가",
      description: "2020학번 원전공자는 연구논문 또는 연구작품 중 하나와 인턴십을 모두 이수해야 합니다.",
      checklist: [
        { label: "연구논문·연구작품 중 한 경로 선택", completed: true },
        { label: "지도교수 배정 및 1년 연구 수행", completed: true },
        { label: "GitHub 기록·온라인 발표·지도교수 평가 60점 이상", completed: false },
        { label: "외부 4주·160시간 또는 교내 연구실 6개월 인턴십", completed: false },
      ],
      timeline: [
        { semester: 4, label: "지도교수 연락" },
        { semester: 5, label: "연구계획 제출" },
        { semester: 6, label: "최종보고·발표" },
      ],
    },
    courses: [
      { code: "GEDC010", name: "성균논어", area: "중점교양", credits: 2, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDM001", name: "고전명저북클럽", area: "중점교양", credits: 3, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDW001", name: "창의적글쓰기", area: "중점교양", credits: 2, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDT017", name: "창의적융합디자인", area: "중점교양", credits: 3, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDT020", name: "AI기초와활용", area: "중점교양", credits: 2, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDG001", name: "영어쓰기", area: "중점교양", credits: 2, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDW003", name: "스피치와토론", area: "중점교양", credits: 2, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDR014", name: "실천리더십", area: "중점교양", credits: 2, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDH003", name: "동양의예술과삶", area: "균형교양", credits: 3, completed: true, requirementIds: ["totalCredits", "balancedGeneral"] },
      { code: "GEDS001", name: "한국사개설", area: "균형교양", credits: 3, completed: true, requirementIds: ["totalCredits", "balancedGeneral"] },
      { code: "DASF003", name: "공학컴퓨터프로그래밍", area: "DS 학과 지정", credits: 3, completed: true, requirementIds: ["totalCredits", "dsEducation"] },
      { code: "DASF004", name: "프로그래밍기초와실습", area: "DS 학과 지정", credits: 3, completed: true, requirementIds: ["totalCredits", "dsEducation"] },
      { code: "SWE3003", name: "데이터베이스개론", area: "전공심화", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE3032", name: "인공지능프로젝트", area: "전공심화", credits: 2, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE3033", name: "데이터베이스프로젝트", area: "전공심화", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE3011", name: "인공지능개론", area: "전공국제어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor", "internationalTotal", "internationalMajor"] },
      { code: "SWE3050", name: "기계학습원론", area: "전공국제어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor", "internationalTotal", "internationalMajor"] },
      { code: "SWE3051", name: "컴퓨터비전개론", area: "전공국제어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor", "internationalTotal", "internationalMajor"] },
      { code: "SWE3052", name: "심층신경망개론", area: "전공국제어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor", "internationalTotal", "internationalMajor"] },
      { code: "SWE2027", name: "소프트웨어실무프로젝트", area: "전공심화", credits: 3, completed: false, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE2029", name: "소프트웨어전공탐색", area: "전공심화", credits: 3, completed: false, requirementIds: ["totalCredits", "primaryMajor"] },
    ],
    notes: [
      "2020학번 소프트웨어학과는 일반 DS 기본과목 대신 DASF003·DASF004를 학과 지정 DS 과목으로 적용합니다.",
      "조기졸업이어도 전공 66학점과 학과 졸업평가는 감면되지 않습니다.",
      "6학기 조기졸업은 연구 일정을 4학기 지도교수 연락, 5학기 계획 제출, 6학기 최종보고 순으로 앞당겨야 합니다.",
    ],
  },
};

export const PERSONAS = {
  economicsDouble: {
    id: "TEST_P05_ECON_DOUBLE",
    name: "정경제",
    studentNumber: "2024123460",
    admissionYear: 2024,
    campus: "인문사회과학캠퍼스",
    college: "경제대학",
    department: "경제학과",
    degreeType: "double_major",
    degreeTypeLabel: "복수전공·국제어 확인",
    secondaryProgram: "미디어커뮤니케이션학과 복수전공",
    earlyGraduation: false,
    currentSemester: 6,
    gpa: 3.72,
    personaType: "시험형 + 복수전공",
    personaSummary: "두 전공의 졸업평가와 국제어 의무를 각각 추적하는 복합 사례",
    sourceStatus: "제도 확인 · 시험 세부기준 재확인",
    sourceUrl: "https://ecostat.skku.edu/ecostat/notice_under.do",
    totalCredits: { completed: 92, required: 120 },
    coreGeneral: { completed: 16, required: 16 },
    balancedGeneral: { completed: 6, required: 6 },
    dsEducation: { completed: 6, required: 6 },
    primaryMajor: { completed: 30, required: 42, detail: "경제학과 복수전공 이수 형태의 제1전공 기준" },
    secondaryMajor: { completed: 21, required: 39, detail: "미디어커뮤니케이션학과 복수전공 학점" },
    creditBreakdown: {
      primaryMajor: [
        { label: "경제학 전공코어", completed: 24, required: 30 },
        { label: "경제학 전공심화", completed: 6, required: 12 },
      ],
      secondaryMajor: [
        { label: "미디어커뮤니케이션 전공", completed: 21, required: 39 },
      ],
    },
    internationalTotal: { completed: 12, required: 18 },
    internationalMajor: { completed: 6, required: 12 },
    specialRequirement: {
      id: "secondaryInternationalCheck",
      label: "제2전공 국제어 기준 확인",
      description: "복수전공자는 각 전공의 국제어 의무를 별도로 확인해야 하며 정확한 학점은 학번별 기준표와 대조합니다.",
      completed: 0,
      required: 1,
      suffix: "건",
    },
    poom: sharedPoom.map((item, index) => ({ ...item, completed: index < 3 })),
    graduationEvaluation: {
      completed: 1,
      required: 4,
      label: "경제학과·미디어커뮤니케이션학과 졸업평가",
      description: "경제학과 졸업시험과 미디어커뮤니케이션학과의 논문 또는 공인어학성적 제출을 각각 확인합니다.",
      checklist: [
        { label: "경제학과 졸업시험 대상 확인", completed: true },
        { label: "경제학과 최신 응시·면제 기준 확인", completed: false },
        { label: "미디어커뮤니케이션 논문 또는 공인어학성적 제출", completed: false },
        { label: "두 전공 최종 승인 확인", completed: false },
      ],
    },
    courses: [
      { code: "ECO2001", name: "경제학원론1", area: "제1전공", credits: 3, completed: true, source: "경제대학 교육과정" },
      { code: "ECO2003", name: "미시경제학", area: "제1전공", credits: 3, completed: true, source: "경제대학 교육과정" },
      { code: "MCJ2102", name: "미디어커뮤니케이션개론", area: "제2전공", credits: 3, completed: true, source: "미디어커뮤니케이션학과 교육과정" },
      { code: "MCJ2040", name: "메타버스와콘텐츠비즈니스", area: "제2전공", credits: 3, completed: false, source: "HUSS 교과목 목록" },
    ],
    notes: [
      "경제학과 졸업시험 시행은 확인됐지만 315점·360점 환산 기준은 경제학과 공식 근거가 없어 적용하지 않았습니다.",
      "복수전공 국제어 의무는 각 전공별 확인 대상으로 표시하고, 숫자는 최신 학번별 기준표 확인 전 확정하지 않습니다.",
    ],
  },
  mediaMicro: {
    id: "TEST_P06_MEDIA_MICRO",
    name: "한미디어",
    studentNumber: "2023123461",
    admissionYear: 2023,
    campus: "인문사회과학캠퍼스",
    college: "사회과학대학",
    department: "미디어커뮤니케이션학과",
    degreeType: "single_major",
    degreeTypeLabel: "단일전공·마이크로디그리",
    secondaryProgram: "지능형 실감미디어와 지역문화 콘텐츠 마이크로디그리",
    earlyGraduation: false,
    currentSemester: 6,
    gpa: 3.81,
    personaType: "복합선택형 + 마이크로디그리",
    personaSummary: "졸업평가 선택지와 9학점 마이크로디그리를 함께 관리하는 사례",
    sourceStatus: "공식 규정 확인",
    sourceUrl: "https://mediacomm.skku.edu/mediacomm/rule/rule_under.do",
    totalCredits: { completed: 89, required: 120 },
    coreGeneral: { completed: 16, required: 16 },
    balancedGeneral: { completed: 6, required: 6 },
    dsEducation: { completed: 6, required: 6 },
    primaryMajor: { completed: 36, required: 54, detail: "미디어커뮤니케이션학과 단일전공" },
    secondaryMajor: null,
    creditBreakdown: {
      primaryMajor: [
        { label: "미디어커뮤니케이션 전공", completed: 36, required: 54 },
      ],
    },
    internationalTotal: { completed: 9, required: 18 },
    internationalMajor: { completed: 6, required: 12 },
    specialRequirement: {
      id: "microdegree",
      label: "실감미디어 마이크로디그리",
      description: "지능형 실감미디어와 지역문화 콘텐츠 과정은 9학점 이수 요건이며 졸업요건과는 별도입니다.",
      completed: 6,
      required: 9,
      suffix: "학점",
    },
    poom: sharedPoom.map((item, index) => ({ ...item, completed: index < 2 })),
    graduationEvaluation: {
      completed: 1,
      required: 3,
      label: "미디어커뮤니케이션학과 졸업평가",
      description: "졸업논문 또는 학과가 정한 공인어학성적 중 하나를 제출합니다.",
      checklist: [
        { label: "논문지도신청서 제출", completed: true },
        { label: "졸업논문 또는 공인어학성적 제출", completed: false },
        { label: "GLS 졸업자가진단 결과 확인", completed: false },
      ],
    },
    courses: [
      { code: "MCJ2102", name: "미디어커뮤니케이션개론", area: "제1전공", credits: 3, completed: true, source: "미디어커뮤니케이션학과 교육과정" },
      { code: "MCJ2040", name: "메타버스와콘텐츠비즈니스", area: "마이크로디그리", credits: 3, completed: true, source: "HUSS 교과목 목록" },
      { code: "MCJ3129", name: "실감형인터랙티브미디어", area: "마이크로디그리", credits: 3, completed: true, source: "HUSS 교과목 목록" },
      { code: "MCJ3131", name: "인터컬쳐럴커뮤니케이션", area: "마이크로디그리", credits: 3, completed: false, source: "HUSS 교과목 목록" },
    ],
    notes: [
      "마이크로디그리는 제1~3전공 이수기준학점을 바꾸지 않는 별도 인증 과정입니다.",
      "공인어학성적은 졸업예정일 기준 2년 이내 취득분만 인정됩니다.",
    ],
  },
  designPractice: {
    id: "TEST_P07_DESIGN",
    name: "윤디자인",
    studentNumber: "2023123462",
    admissionYear: 2023,
    campus: "인문사회과학캠퍼스",
    college: "예술대학",
    department: "디자인학과",
    degreeType: "single_major",
    degreeTypeLabel: "단일전공·졸업전시",
    secondaryProgram: "없음",
    earlyGraduation: false,
    currentSemester: 7,
    gpa: 3.66,
    personaType: "예술·실기형",
    personaSummary: "포트폴리오와 졸업전시 마일스톤을 교과목과 연결하는 사례",
    sourceStatus: "교과목 확인 · 필수 여부 재확인",
    sourceUrl: "https://design.skku.edu/design/dept_curriculum.do",
    totalCredits: { completed: 105, required: 120 },
    coreGeneral: { completed: 16, required: 16 },
    balancedGeneral: { completed: 6, required: 6 },
    dsEducation: { completed: 6, required: 6 },
    primaryMajor: { completed: 45, required: 54, detail: "시각디자인전공 교과와 졸업 프로젝트" },
    secondaryMajor: null,
    creditBreakdown: { primaryMajor: [{ label: "디자인 전공", completed: 45, required: 54 }] },
    internationalTotal: { completed: 9, required: 18 },
    internationalMajor: { completed: 6, required: 12 },
    poom: sharedPoom.map((item, index) => ({ ...item, completed: index < 3 })),
    graduationEvaluation: {
      completed: 2,
      required: 4,
      label: "디자인학과 졸업전시·포트폴리오",
      description: "공식 교육과정의 졸업전시·포트폴리오 연계 과목을 기준으로 준비 단계를 추적합니다.",
      checklist: [
        { label: "졸업 프로젝트 주제 확정", completed: true },
        { label: "DES3032 디자인리서치 이수", completed: true },
        { label: "개인 포트폴리오 심사", completed: false },
        { label: "졸업전시 결과물 제출", completed: false },
      ],
    },
    courses: [
      { code: "DES2031", name: "크리에이티브디자인", area: "제1전공", credits: 3, completed: true, source: "디자인학과 교육과정" },
      { code: "DES3032", name: "디자인리서치", area: "졸업프로젝트", credits: 3, completed: true, source: "AIEX 개설과목 공지" },
      { code: "DES3045", name: "UXUI디자인1", area: "제1전공", credits: 3, completed: false, source: "AIEX 개설과목 공지" },
      { code: "DES4001", name: "융합캡스톤디자인", area: "졸업프로젝트", credits: 3, completed: false, source: "AIEX 개설과목 공지" },
      { code: "DES3048", name: "디자인앤포트폴리오", area: "졸업프로젝트", credits: 3, completed: false, source: "AIEX 교과목 목록" },
    ],
    notes: ["졸업전시 관련 과목은 공식 로드맵에서 확인되지만 최종 필수 이수 여부는 학과 공지와 대조해야 합니다."],
  },
  chemistryChallenge: {
    id: "TEST_P08_CHEM_CHALLENGE",
    name: "오화학",
    studentNumber: "2024123463",
    admissionYear: 2024,
    campus: "자연과학캠퍼스",
    college: "자연과학대학",
    department: "화학과",
    degreeType: "single_major",
    degreeTypeLabel: "단일전공·도전학기",
    secondaryProgram: "없음",
    earlyGraduation: false,
    currentSemester: 6,
    gpa: 3.77,
    personaType: "연구실 기반 기초과학형",
    personaSummary: "학부 연구와 졸업논문 사이클에 도전학기 선택을 결합한 사례",
    sourceStatus: "공식 학과 공지 확인",
    sourceUrl: "https://professor.skku.edu/chem/News/notice.do",
    totalCredits: { completed: 94, required: 130 },
    coreGeneral: { completed: 16, required: 16 },
    balancedGeneral: { completed: 6, required: 6 },
    dsEducation: { completed: 6, required: 6 },
    primaryMajor: { completed: 42, required: 60, detail: "화학과 전공과 학부 연구 교과목" },
    secondaryMajor: null,
    creditBreakdown: { primaryMajor: [{ label: "화학 전공", completed: 42, required: 60 }] },
    internationalTotal: { completed: 12, required: 18 },
    internationalMajor: { completed: 6, required: 12 },
    specialRequirement: {
      id: "challengeSemester",
      label: "도전학기 연구계획",
      description: "도전학기 3학점 연구계획을 현재 학업계획에 반영한 상태입니다.",
      completed: 3,
      required: 3,
      suffix: "학점",
    },
    whatIfData: { challengeCredits: 3 },
    poom: sharedPoom.map((item, index) => ({ ...item, completed: index < 2 })),
    graduationEvaluation: {
      completed: 2,
      required: 4,
      label: "화학과 학부 연구·졸업논문",
      description: "2~3학년 화학개별연구에서 4학년 졸업논문연구와 논문 제출로 이어지는 연구 사이클입니다.",
      checklist: [
        { label: "연구실·지도교수 배정", completed: true },
        { label: "CHY3035 또는 CHY3037 화학개별연구", completed: true },
        { label: "CHY3021 졸업논문연구 수강", completed: false },
        { label: "졸업논문 제출·심사", completed: false },
      ],
    },
    courses: [
      { code: "CHY3035", name: "화학개별연구2", area: "연구교과", credits: 2, completed: true, source: "화학과 교육과정·2025-2 공지" },
      { code: "CHY3037", name: "화학개별연구4", area: "연구교과", credits: 2, completed: false, source: "화학과 교육과정·2025-2 공지" },
      { code: "CHY3021", name: "졸업논문연구", area: "졸업평가", credits: 2, completed: false, source: "화학과 2025-2 수강 공지" },
    ],
    notes: ["CHY3021 수강과 학부 졸업논문 제출은 서로 다른 절차이므로 각각 완료 여부를 확인합니다."],
  },
  pharmacyClinical: {
    id: "TEST_P09_PHARMACY",
    name: "서약학",
    studentNumber: "2024123464",
    admissionYear: 2024,
    campus: "자연과학캠퍼스",
    college: "약학대학",
    department: "약학과",
    degreeType: "single_major",
    degreeTypeLabel: "통합6년제·장기실무실습",
    secondaryProgram: "없음",
    earlyGraduation: false,
    requiredSemesters: 12,
    currentSemester: 8,
    gpa: 3.58,
    personaType: "국가면허·장기 임상형",
    personaSummary: "12학기 등록과 병원·약국·제약 실습을 장기간 누적하는 사례",
    sourceStatus: "2026 약학대학 내규 확인",
    sourceUrl: "https://pharm.skku.edu/academics/degree02.php",
    totalCredits: { completed: 156, required: 230 },
    coreGeneral: { completed: 16, required: 16 },
    balancedGeneral: { completed: 6, required: 6 },
    dsEducation: { completed: 6, required: 6 },
    primaryMajor: { completed: 121, required: 185, detail: "전공코어 137 · 전공심화 38 · 실험실습 10학점" },
    secondaryMajor: null,
    creditBreakdown: {
      primaryMajor: [
        { label: "전공코어", completed: 98, required: 137 },
        { label: "전공심화", completed: 18, required: 38 },
        { label: "실험실습", completed: 5, required: 10 },
      ],
    },
    internationalTotal: { completed: 9, required: 18 },
    internationalMajor: { completed: 6, required: 12 },
    poom: sharedPoom.map((item, index) => ({ ...item, completed: index < 2 })),
    graduationEvaluation: {
      completed: 1,
      required: 5,
      label: "약학과 심화실무실습·졸업평가",
      description: "2022학번 이후는 심화실무실습 중 하나를 8주 이상 수행하고 실험실습보고서 심사를 통과합니다.",
      checklist: [
        { label: "PHR3015 약학연구1", completed: true },
        { label: "병원 10주·약국 5주·제약 3주 필수실무실습", completed: false },
        { label: "심화실무실습 경로 선택", completed: false },
        { label: "8주 이상 개별연구·실습", completed: false },
        { label: "종료 후 2주 이내 보고서 제출·심사", completed: false },
      ],
    },
    courses: [
      { code: "PHR3015", name: "약학연구1", area: "실험실습", credits: 5, completed: true, source: "약학대학 학부 교육과정" },
      { code: "PHR3016", name: "약학연구2", area: "심화실무실습", credits: 5, completed: false, source: "약학대학 학부 교육과정" },
    ],
    notes: ["학수번호가 공식 교육과정 화면에서 확인되지 않은 실무실습은 임의 번호를 만들지 않고 학과지정 항목으로 표시합니다."],
  },
  educationTeaching: {
    id: "TEST_P10_EDUCATION",
    name: "임교육",
    studentNumber: "2024123465",
    admissionYear: 2024,
    campus: "인문사회과학캠퍼스",
    college: "사범대학",
    department: "교육학과",
    degreeType: "single_major",
    degreeTypeLabel: "단일전공·교직이수",
    secondaryProgram: "없음",
    earlyGraduation: false,
    currentSemester: 6,
    gpa: 3.79,
    personaType: "사범대·교직 복합형",
    personaSummary: "학위요건과 교원자격 발급 절차를 구분해 동시에 추적하는 사례",
    sourceStatus: "사범대 자가진단표 확인",
    sourceUrl: "https://coe.skku.edu/coe/community/data_info.do",
    totalCredits: { completed: 88, required: 120 },
    coreGeneral: { completed: 16, required: 16 },
    balancedGeneral: { completed: 6, required: 6 },
    dsEducation: { completed: 6, required: 6 },
    primaryMajor: { completed: 33, required: 54, detail: "교육학 전공 및 교과교육영역" },
    secondaryMajor: null,
    creditBreakdown: {
      primaryMajor: [
        { label: "교육학 전공", completed: 24, required: 33 },
        { label: "교과교육·교직", completed: 9, required: 21 },
      ],
    },
    internationalTotal: { completed: 12, required: 18 },
    internationalMajor: { completed: 6, required: 12 },
    specialRequirement: {
      id: "teachingCertificate",
      label: "교원자격 활동",
      description: "교직인적성 2회와 응급처치·심폐소생술 2회를 별도로 추적합니다.",
      completed: 2,
      required: 4,
      suffix: "회",
    },
    poom: sharedPoom.map((item, index) => ({ ...item, completed: index < 3 })),
    graduationEvaluation: {
      completed: 2,
      required: 5,
      label: "교육학과 졸업평가·교원자격",
      description: "졸업논문·졸업시험·대체자격증 중 하나와 교직 활동, 무시험검정원 제출을 확인합니다.",
      checklist: [
        { label: "전공 75점·교직 80점 이상 확인", completed: true },
        { label: "졸업평가 경로 선택", completed: true },
        { label: "교직인적성 2회 적격", completed: false },
        { label: "응급처치·심폐소생술 2회", completed: false },
        { label: "졸업예정학기 무시험검정원 제출", completed: false },
      ],
    },
    courses: [
      { code: "EDU2002", name: "교육심리학", area: "제1전공", credits: 3, completed: true, source: "2024 사범대 기본이수과목" },
      { code: "EDU2006", name: "교육과정", area: "제1전공", credits: 3, completed: true, source: "2024 사범대 기본이수과목" },
      { code: "EDU2009", name: "교육평가", area: "제1전공", credits: 3, completed: false, source: "2024 사범대 기본이수과목" },
      { code: "CFTD035", name: "교육학교육론", area: "교과교육", credits: 3, completed: true, source: "사범대 교직 기본이수과목" },
      { code: "CFTD064", name: "교육학교재연구및지도법", area: "교과교육", credits: 3, completed: false, source: "사범대 교직 기본이수과목" },
      { code: "CFTD079", name: "교육학교과논리논술", area: "교과교육", credits: 2, completed: false, source: "2024 사범대 교직 기본이수과목" },
    ],
    notes: ["교직 활동은 학위 졸업과 교원자격 발급의 관계를 구분해 최종적으로 사범대 행정실에서 확인합니다."],
  },
};

export function clonePersona(key = "economicsDouble") {
  const persona = PERSONAS[key] || LEGACY_PERSONAS[key] || PERSONAS.economicsDouble;
  return ensureEvidenceData(JSON.parse(JSON.stringify(persona)));
}

function inferCourseRequirements(course) {
  const ids = ["totalCredits"];
  const area = course.area || "";
  if (/DS/.test(area)) ids.push("dsEducation");
  if (/중점교양/.test(area)) ids.push("coreGeneral");
  if (/균형교양/.test(area)) ids.push("balancedGeneral");
  if (/제2전공/.test(area)) ids.push("secondaryMajor");
  if (/전공|I-Core|캡스톤|종합설계|실험실습|실험·실습/.test(area) && !/제2전공/.test(area)) ids.push("primaryMajor");
  if (/국제어|I-Core/.test(area)) ids.push("internationalTotal");
  if (/전공국제어|I-Core/.test(area)) ids.push("internationalMajor");
  return [...new Set(ids)];
}

const requirementCourseTemplates = {
  coreGeneral: [
    "성균논어",
    "창의적글쓰기",
    "영어커뮤니케이션",
    "문제해결과논리",
    "AI기초와활용",
    "데이터리터러시",
  ],
  balancedGeneral: [
    "현대사회와윤리",
    "과학기술과사회",
    "문화와예술의이해",
    "글로벌사회와문화",
  ],
  dsEducation: [
    "공학컴퓨터프로그래밍",
    "프로그래밍기초와실습",
    "데이터분석기초",
  ],
  primaryMajor: [
    "전공기초",
    "전공핵심",
    "전공심화",
    "실험실습",
    "종합설계",
    "전공프로젝트",
  ],
  secondaryMajor: [
    "융합트랙 지정과목",
    "연계전공 기초",
    "연계전공 심화",
    "산학프로젝트",
  ],
  internationalTotal: [
    "Academic English",
    "Global Communication",
    "국제어수업 교양",
  ],
  internationalMajor: [
    "전공 국제어수업 1",
    "전공 국제어수업 2",
    "전공 국제어수업 3",
  ],
};

const requirementAreaLabels = {
  coreGeneral: "중점교양",
  balancedGeneral: "균형교양",
  dsEducation: "DS 교육과정",
  primaryMajor: "제1전공",
  secondaryMajor: "제2전공·연계·융합",
  internationalTotal: "국제어수업",
  internationalMajor: "전공 국제어수업",
};

const majorCoreCourseCodes = new Set([
  "ECH2005",
  "ECH2006",
  "ECH2007",
  "ECH2031",
  "ECH2032",
  "ECH3016",
  "ECH3053",
  "GBA1001",
  "GBA2005",
  "GBA3001",
  "GBA3011",
  "GBA3021",
  "GBA3031",
]);

function getPrimaryMajorArea(course) {
  const code = normalizeCourseCode(course?.code);
  const area = String(course?.area || "");
  const name = String(course?.name || "");
  if (/실험|실습|프로젝트|캡스톤/.test(`${area} ${name}`)) return "실험실습";
  if (/전공코어|전공기초|전공핵심|I-Core/.test(area) || majorCoreCourseCodes.has(code)) return "전공코어";
  return "전공심화";
}

function normalizePrimaryMajorArea(course) {
  if (!(course?.requirementIds || []).includes("primaryMajor")) return course;
  return {
    ...course,
    area: getPrimaryMajorArea(course),
  };
}

const requiredGeneralCourseCodes = new Set([
  "GEDC010",
  "GEDM001",
  "GEDW001",
  "GEDT017",
  "GEDT020",
  "GEDG001",
  "GEDW003",
  "GEDR014",
]);

const dsCourseRules = {
  2020: {
    rangeLabel: "2020학번",
    commonRequired: new Set([]),
    engineeringRequired: new Set(["DASF003", "DASF004"]),
  },
  "2021-2024": {
    rangeLabel: "2021~2024학번",
    commonRequired: new Set(["GEDT020", "GEDT014", "GEDT015"]),
    engineeringRequired: new Set(["GEDT018", "GEDT019", "DASF003", "DASF004"]),
  },
  2025: {
    rangeLabel: "2025학번",
    commonRequired: new Set(["DASF008"]),
    engineeringRequired: new Set(["DASF003", "DASF004"]),
  },
};

function getDsRuleForAdmissionYear(admissionYear) {
  const year = Number(admissionYear || 0);
  if (year >= 2025) return dsCourseRules[2025];
  if (year >= 2021 && year <= 2024) return dsCourseRules["2021-2024"];
  if (year <= 2020) return dsCourseRules[2020];
  return null;
}

function isEngineeringDsTrack(profile) {
  return /공학|소프트웨어|반도체|소재부품|에너지|양자정보|바이오메디컬/.test(`${profile?.college || ""} ${profile?.department || ""}`);
}

function getCourseBadges(course, profile) {
  const badges = new Set(course.badges || []);
  const code = normalizeCourseCode(course.code);
  const requirementIds = course.requirementIds || [];
  if (requirementIds.includes("coreGeneral") && requiredGeneralCourseCodes.has(code)) {
    badges.add("필수교양");
  }

  const dsRule = getDsRuleForAdmissionYear(profile?.admissionYear);
  if (dsRule?.commonRequired.has(code)) {
    badges.add(`${dsRule.rangeLabel} DS 공통필수`);
  }
  if (dsRule && isEngineeringDsTrack(profile) && dsRule.engineeringRequired.has(code)) {
    badges.add(`${dsRule.rangeLabel} DS기반 필수`);
  }

  return [...badges];
}

function annotateCourseMetadata(course, profile) {
  return {
    ...course,
    badges: getCourseBadges(course, profile),
  };
}

const officialCourseCatalog = {
  GEDC010: { name: "성균논어", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDC015: { name: "앙트레프레너십과리더십", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDR014: { name: "실천리더십", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDM001: { name: "고전명저북클럽", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDT006: { name: "창의적사고", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDT010: { name: "창의와사유의기초", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDT011: { name: "창의적발상", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDT017: { name: "창의적융합디자인", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDT014: { name: "컴퓨팅사고와SW코딩", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDT015: { name: "문제해결과알고리즘", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDT018: { name: "공학컴퓨터프로그래밍", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDT019: { name: "프로그래밍기초와실습", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDT020: { name: "AI기초와활용", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDW001: { name: "창의적글쓰기", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDW003: { name: "스피치와토론", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDG001: { name: "영어쓰기", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDG002: { name: "영어발표", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDG004: { name: "법률영어", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDG005: { name: "비즈니스영어", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDG006: { name: "과학영어", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDG029: { name: "영어토론", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDG035: { name: "커리어영어", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDG037: { name: "앙트레프레너십영어", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDG038: { name: "뉴스와미디어의이해", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDH003: { name: "동양의예술과삶", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDH018: { name: "음악의이해", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDH020: { name: "한국문화의이해", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDH062: { name: "지식정보학", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDS001: { name: "한국사개설", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDS019: { name: "한국경제의이해", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDS024: { name: "공학경제", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDS035: { name: "한국역사의이해", credits: 2, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDS036: { name: "한국생활의안내및진로지도1", credits: 1, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDS040: { name: "기업가정신", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDS046: { name: "이공계경영학", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN001: { name: "과학사", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN002: { name: "생태계와환경", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN003: { name: "생명의기원과본질", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN005: { name: "현대천문학개론", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN006: { name: "우주론", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN007: { name: "생활속의화학", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN008: { name: "화학과생명현상", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN012: { name: "생명의과학", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN013: { name: "생명공학의이해", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN014: { name: "생명과음식의과학", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN021: { name: "과학기술과환경", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN029: { name: "운동과건강", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN032: { name: "약과건강", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN033: { name: "특허와창업", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN035: { name: "창업이론과실제", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN047: { name: "인공지능을위한기초수학", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDN048: { name: "인공지능의이해", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB001: { name: "미분적분학1", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB002: { name: "미분적분학2", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB003: { name: "선형대수학", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB004: { name: "공학수학1", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB007: { name: "이산수학", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB008: { name: "일반물리학1", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB009: { name: "일반물리학실험1", credits: 1, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB011: { name: "일반물리학실험2", credits: 1, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB012: { name: "일반화학1", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB013: { name: "일반화학실험1", credits: 1, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB015: { name: "일반화학실험2", credits: 1, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB017: { name: "생명과학실험1", credits: 1, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB019: { name: "생명과학실험2", credits: 1, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB028: { name: "확률및통계", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB031: { name: "미분적분학실습1", credits: 1, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB032: { name: "미분적분학실습2", credits: 1, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  GEDB033: { name: "빅데이터와통계학", credits: 3, source: "성균관대 2020-2 교양과목 학수번호 PDF" },
  BIO3004: { name: "미생물학", credits: 3, source: "킹고포털 2026-2 화학공학부 전공과목 조회" },
  EAM7001: { name: "플라즈마공정및장비", credits: 3, source: "킹고포털 2026-2 화학공학부 전공과목 조회" },
  ECH2005: { name: "화공열역학1", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2006: { name: "화공열역학2", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2007: { name: "화공유체역학", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2011: { name: "화공기기분석", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2013: { name: "생물화학공학", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2022: { name: "고체화학공학", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2025: { name: "생물공정공학", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2029: { name: "응용생명공학", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2030: { name: "융복합소재개론", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2031: { name: "화공계산", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2033: { name: "고분자공학입문", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2034: { name: "화공생화학", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2035: { name: "화공물리화학1", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2036: { name: "화공물리화학2", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2037: { name: "화공유기화학1", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH2038: { name: "화공유기화학2", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3009: { name: "환경화학공학", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3010: { name: "에너지공학", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3013: { name: "고분자화학", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3016: { name: "분리공정", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3024: { name: "화학공학실험1", credits: 2, source: "성균관대 화학공학부 교과과정" },
  ECH3025: { name: "화학공학실험2", credits: 2, source: "성균관대 화학공학부 교과과정" },
  ECH3030: { name: "화학공학현장실습2", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3031: { name: "화학공학현장실습4", credits: 5, source: "성균관대 화학공학부 교과과정" },
  ECH3035: { name: "화학공학현장실습1", credits: 2, source: "성균관대 화학공학부 교과과정" },
  ECH3036: { name: "화학공학현장실습3", credits: 4, source: "성균관대 화학공학부 교과과정" },
  ECH3040: { name: "공정해석및장치설계", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3048: { name: "에너지소재", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3052: { name: "공정설계입문", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3053: { name: "반응공학", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3054: { name: "고분자 응용", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3057: { name: "고분자물리", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3059: { name: "생명화학소재", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3060: { name: "화공전자재료", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3062: { name: "디스플레이소재및공정", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3063: { name: "메디컬생체재료", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3064: { name: "화학공학창업현장실습", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3065: { name: "나노바이오융합공학", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3066: { name: "전지공학입문", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3067: { name: "공정제어및설계", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3068: { name: "물리화학기초실험", credits: 2, source: "성균관대 화학공학부 교과과정" },
  ECH3069: { name: "화공인공지능", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3071: { name: "바이오헬스케어공학", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3072: { name: "전지용고분자소재", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH3073: { name: "화공종합설계", credits: 3, source: "성균관대 화학공학부 교과과정" },
  ECH4013: { name: "화학공정설계및모사", credits: 3, source: "킹고포털 2026-2 화학공학부 전공과목 조회" },
  ECH4015: { name: "석사논문연구2", credits: 3, source: "킹고포털 2026-2 화학공학부 전공과목 조회" },
  ECH7002: { name: "표면기기분석", credits: 3, source: "킹고포털 2026-2 화학공학부 전공과목 조회" },
  ECH7006: { name: "생명공학연구동향및응용", credits: 3, source: "킹고포털 2026-2 화학공학부 전공과목 조회" },
  ECH7008: { name: "화공세미나2", credits: 1, source: "킹고포털 2026-2 화학공학부 전공과목 조회" },
  EEE2013: { name: "전자회로1", credits: 3, source: "킹고포털 2026-2 화학공학부 전공과목 조회" },
  EEE3006: { name: "광학기초", credits: 3, source: "킹고포털 2026-2 화학공학부 전공과목 조회" },
  ERC2007: { name: "공학수치해석", credits: 3, source: "킹고포털 2026-2 화학공학부 전공과목 조회" },
  ERC2008: { name: "기술경영개론", credits: 3, source: "킹고포털 2026-2 화학공학부 전공과목 조회" },
  ERC2011: { name: "공학기초수학2", credits: 3, source: "킹고포털 2026-2 화학공학부 전공과목 조회" },
  SCM3001: { name: "반도체종합설비기술", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  SSE2018: { name: "반도체소자", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  SSE3036: { name: "반도체공정", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  EAM2057: { name: "신소재공학 개론1", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  EAM2058: { name: "신소재공학 개론2", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  EAM3003: { name: "상변태학", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  EAM4019: { name: "전자 패키지공학", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  ECH2019: { name: "공업유기화학1", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  ECH2032: { name: "화공열및물질전달", credits: 3, source: "성균관대 화학공학부 교과과정 · 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  ECH3061: { name: "반도체화학공정", credits: 3, source: "성균관대 화학공학부 교과과정 · 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  ECH4017: { name: "플라즈마공정및응용", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  EME2007: { name: "열역학", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  EME2008: { name: "유체역학", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  EME2012: { name: "고체역학", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  EME4908: { name: "박막공정및물성", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  SNT4013: { name: "나노물성 측정론", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  ENA3030: { name: "나노전달현상개론", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  SEE7001: { name: "반도체공정및장비기술", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  ASE3002: { name: "반도체제품개론", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  ASE3003: { name: "진공및플라즈마", credits: 3, source: "성균관대 반도체소재부품장비패키징 융합트랙 교과목 구성" },
  DASF003: { name: "공학컴퓨터프로그래밍", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  DASF004: { name: "프로그래밍기초와실습", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  DASF008: { name: "데이터분석과AI기초", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  ESW4011: { name: "AI를활용한소프트웨어보안", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  ESW4017: { name: "디지털헬스케어보안세미나", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  ESW4024: { name: "추천시스템개론", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  ESW4025: { name: "인공지능윤리", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  ESW4028: { name: "생성형인공지능특론", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  SWE2027: { name: "소프트웨어실무프로젝트", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  SWE2029: { name: "소프트웨어전공탐색", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  SWE3003: { name: "데이터베이스개론", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  SWE3032: { name: "인공지능프로젝트", credits: 2, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  SWE3033: { name: "데이터베이스프로젝트", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  SWE3051: { name: "컴퓨터비전개론", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  ISW2001: { name: "기계학습수학", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  AAI2009: { name: "인공지능개론", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  AAI2015: { name: "자료구조및알고리즘개론", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  AAI3006: { name: "기계학습", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  AAI2011: { name: "시스템프로그래밍", credits: 3, source: "성균관대 소프트웨어학과 교육과정" },
  AIM4003: { name: "자연어처리개론", credits: 3, source: "성균관대 소프트웨어학과 교육과정" },
  CSE3036: { name: "컴퓨터공학세미나", credits: 1, source: "성균관대 소프트웨어학과 교육과정" },
  CHS7001: { name: "블록체인의기초", credits: 3, source: "성균관대 소프트웨어학과 교육과정" },
  CHS7002: { name: "머신러닝과딥러닝", credits: 3, source: "성균관대 소프트웨어학과 교육과정" },
  CHS7003: { name: "인공지능응용", credits: 3, source: "성균관대 소프트웨어학과 교육과정" },
  ECE4249: { name: "컴퓨터비전", credits: 3, source: "성균관대 소프트웨어학과 교육과정" },
  EEE3049: { name: "컴퓨터네트워크개론", credits: 3, source: "성균관대 소프트웨어학과 교육과정" },
  SWE3011: { name: "인공지능개론", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  SWE3050: { name: "기계학습원론", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  SWE3052: { name: "심층신경망개론", credits: 3, source: "성균관대 SW-AI-AX 전교생 교육 AX융합전공" },
  BIZ2028: { name: "글로벌창업과비즈니스", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BIZ2031: { name: "AI로분석하는투자자심리학", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BIZ3002: { name: "경영대학연구학점Ⅰ", credits: 2, source: "성균관대 글로벌경영학과 교육과정" },
  BIZ3003: { name: "경영대학연구학점Ⅱ", credits: 2, source: "성균관대 글로벌경영학과 교육과정" },
  BIZ3007: { name: "글로벌기업의마케팅전략관리", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BIZ3012: { name: "비즈니스캡스톤디자인", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BIZ3015: { name: "AI와비즈니스", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BIZ3019: { name: "캡스톤디자인:마케팅", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BIZ3021: { name: "디지털혁신전략", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BIZ3022: { name: "캡스톤디자인:세일즈매니지먼트", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BIZ3025: { name: "소비자뇌과학과인공지능", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BUS2001: { name: "경영학원론", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BUS2020: { name: "원가회계", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BUS2023: { name: "고급회계", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BUS2030: { name: "중급회계2", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BUS3019: { name: "세무회계", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BUS3020: { name: "회계감사", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BUS3030: { name: "포트폴리오관리", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BUS3031: { name: "마케팅커뮤니케이션", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
  BUS3040: { name: "벤처파이낸싱", credits: 3, source: "성균관대 글로벌경영학과 교육과정" },
};

const officialSupplementalCourses = {
  coreGeneral: [
    "GEDC010",
    "GEDM001",
    "GEDW001",
    "GEDT017",
    "GEDT020",
    "GEDG001",
    "GEDW003",
    "GEDR014",
    "GEDT006",
  ],
  balancedGeneral: [
    "GEDH003",
    "GEDS001",
    "GEDN001",
    "GEDB001",
    "GEDH018",
    "GEDS024",
    "GEDN007",
    "GEDB003",
  ],
  dsEducation: [
    "GEDT018",
    "GEDT019",
    "GEDT014",
    "GEDT015",
    "GEDT020",
    "DASF003",
    "DASF004",
  ],
  totalCredits: [
    "GEDB002",
    "GEDB004",
    "GEDB007",
    "GEDB008",
    "GEDB009",
    "GEDB011",
    "GEDB012",
    "GEDB013",
    "GEDB015",
    "GEDB017",
    "GEDB019",
    "GEDB028",
    "GEDB031",
    "GEDB032",
    "GEDB033",
    "GEDN047",
    "GEDN048",
    "GEDS040",
    "GEDS046",
    "GEDS019",
    "GEDH020",
    "GEDH062",
    "GEDG002",
    "GEDC015",
    "GEDT010",
    "GEDT011",
    "GEDH018",
    "GEDG004",
    "GEDG005",
    "GEDG006",
    "GEDG029",
    "GEDG035",
    "GEDG037",
    "GEDG038",
    "GEDS035",
    "GEDS036",
    "GEDN002",
    "GEDN003",
    "GEDN005",
    "GEDN006",
    "GEDN008",
    "GEDN012",
    "GEDN013",
    "GEDN014",
    "GEDN021",
    "GEDN029",
    "GEDN032",
    "GEDN033",
    "GEDN035",
  ],
  internationalTotal: [
    "GEDG001",
    "GEDG002",
    "GEDG004",
    "GEDG005",
    "GEDG006",
    "GEDG029",
    "GEDG035",
  ],
};

const departmentSupplementalCourses = {
  "화학공학부": {
    primaryMajor: [
      "ECH2011",
      "ECH2022",
      "ECH2030",
      "ECH2032",
      "ECH2033",
      "ECH2034",
      "ECH2036",
      "ECH2038",
      "ECH3016",
      "ECH3024",
      "ECH3025",
      "ECH3053",
      "ECH3060",
      "ECH3067",
      "ECH3068",
      "ECH3071",
      "ECH3072",
      "ECH3073",
      "ECH4013",
      "ERC2007",
      "ERC2008",
      "ERC2011",
      "BIO3004",
      "EEE2013",
      "EEE3006",
    ],
    internationalMajor: [
      "ECH2032",
      "ECH2034",
      "ECH2036",
      "ECH2038",
      "ECH3016",
      "ECH3053",
      "ECH3060",
      "ECH3061",
      "ECH3066",
      "ECH3067",
      "ECH3068",
      "ECH3072",
      "ECH4013",
    ],
  },
  "소프트웨어학과": {
    primaryMajor: [
      "AAI2011",
      "AAI2009",
      "AAI2015",
      "AAI3006",
      "AIM4003",
      "CHS7001",
      "CHS7002",
      "CHS7003",
      "CSE3036",
      "ECE4249",
      "EEE3049",
      "ESW4011",
      "ESW4024",
      "ESW4025",
      "ESW4028",
      "SWE2027",
      "SWE2029",
      "SWE3003",
      "SWE3032",
      "SWE3033",
      "SWE3011",
      "SWE3050",
      "SWE3051",
      "SWE3052",
    ],
    internationalMajor: [
      "AIM4003",
      "ECE4249",
      "SWE3011",
      "SWE3050",
      "SWE3051",
      "SWE3052",
      "ESW4028",
    ],
  },
  "글로벌경영학과": {
    primaryMajor: [
      "BIZ2028",
      "BIZ2031",
      "BIZ3007",
      "BIZ3012",
      "BIZ3015",
      "BIZ3019",
      "BIZ3021",
      "BIZ3022",
      "BIZ3025",
      "BUS2001",
      "BUS2020",
      "BUS2023",
      "BUS2030",
      "BUS3019",
      "BUS3020",
      "BUS3030",
      "BUS3031",
      "BUS3040",
    ],
    internationalMajor: [
      "BIZ2031",
      "BIZ3015",
      "BIZ3025",
    ],
  },
};

function normalizeCourseCode(code) {
  return String(code || "").trim().toUpperCase();
}

function isSyntheticCourse(course) {
  const code = normalizeCourseCode(course?.code);
  const legacyDemoCodes = new Set(["GEDT001", "GEDT002", "GEDT003", "GEDT004", "GEDT005"]);
  return /^GLS-/.test(code) || /^FREE\d+/.test(code) || legacyDemoCodes.has(code);
}

function normalizeOfficialCourse(course) {
  const code = normalizeCourseCode(course.code);
  const official = officialCourseCatalog[code];
  if (!official) return { ...course, code };
  return {
    ...course,
    code,
    name: official.name,
    credits: official.credits,
    source: official.source,
    verified: true,
  };
}

function buildOfficialSupplementalCourse(profile, requirementId, code, index) {
  const official = officialCourseCatalog[code];
  if (!official) return null;
  return normalizePrimaryMajorArea(normalizeOfficialCourse({
    id: `OFFICIAL-${profile.studentNumber}-${requirementId}-${code}`,
    code,
    name: official.name,
    area: requirementId === "totalCredits" ? "일반선택" : requirementAreaLabels[requirementId] || "인정 교과목",
    credits: official.credits,
    completed: true,
    term: getSampleCourseTerm(profile, index),
    grade: ["A+", "A0", "B+", "B0"][index % 4],
    source: official.source,
    requirementIds: requirementId === "totalCredits" ? ["totalCredits"] : ["totalCredits", requirementId],
  }));
}

function getOfficialSupplementalCodes(profile, requirementId) {
  const departmentCodes = departmentSupplementalCourses[profile.department]?.[requirementId] || [];
  const commonCodes = officialSupplementalCourses[requirementId] || [];
  return [...new Set([...departmentCodes, ...commonCodes])];
}

function getRequirementEvidenceCredits(profile, requirementId) {
  return profile.courses
    .filter((course) => course.completed && (course.requirementIds || []).includes(requirementId))
    .reduce((sum, course) => sum + Number(course.credits || 0), 0);
}

function makeSupplementalCourses(profile, requirementId, missingCredits, usedCodes = new Set()) {
  const courses = [];
  let remaining = Math.max(0, Math.round(Number(missingCredits || 0) * 10) / 10);
  const templateCodes = getOfficialSupplementalCodes(profile, requirementId);
  templateCodes.forEach((code, index) => {
    if (remaining <= 0 || usedCodes.has(code)) return;
    const course = buildOfficialSupplementalCourse(profile, requirementId, code, index);
    if (!course || Number(course.credits || 0) > remaining) return;
    courses.push(course);
    usedCodes.add(code);
    remaining = Math.round((remaining - Number(course.credits || 0)) * 10) / 10;
  });
  return { courses, remaining };
}

function addOfficialSupplementalCourses(profile, requirementId, missingCredits, usedCodes) {
  let remaining = Math.max(0, Math.round(Number(missingCredits || 0) * 10) / 10);
  const added = [];
  let attempts = 0;
  while (remaining > 0 && attempts < 4) {
    const result = makeSupplementalCourses(profile, requirementId, remaining, usedCodes);
    added.push(...result.courses);
    remaining = result.remaining;
    if (!result.courses.length) break;
    attempts += 1;
  }
  profile.courses.push(...added);
  return remaining;
}

function supplementCourseEvidence(profile) {
  const gaps = [];
  const usedCodes = new Set((profile.courses || []).map((course) => normalizeCourseCode(course.code)));
  const requirementIds = [
    "coreGeneral",
    "balancedGeneral",
    "dsEducation",
    "primaryMajor",
    "secondaryMajor",
    "internationalTotal",
    "internationalMajor",
  ];

  requirementIds.forEach((id) => {
    const target = Number(profile[id]?.completed || 0);
    if (!target) return;
    const current = getRequirementEvidenceCredits(profile, id);
    const missing = Math.max(0, target - current);
    if (missing > 0) {
      const remaining = addOfficialSupplementalCourses(profile, id, missing, usedCodes);
      if (remaining > 0) {
        gaps.push({
          requirementId: id,
          label: requirementAreaLabels[id] || id,
          missingCredits: remaining,
        });
      }
    }
  });

  const totalTarget = Number(profile.totalCredits?.completed || 0);
  const totalCurrent = getRequirementEvidenceCredits(profile, "totalCredits");
  const totalMissing = Math.max(0, totalTarget - totalCurrent);
  if (totalMissing > 0) {
    const remaining = addOfficialSupplementalCourses(profile, "totalCredits", totalMissing, usedCodes);
    if (remaining > 0) {
      gaps.push({
        requirementId: "totalCredits",
        label: "총 졸업학점",
        missingCredits: remaining,
      });
    }
  }
  profile.courseEvidenceGaps = gaps;
}

function getSampleCourseTerm(profile, index) {
  const startYear = Number(profile.admissionYear || 2020);
  const termIndex = Math.min(7, Math.floor(Number(index || 0) / 5));
  const year = startYear + Math.floor(termIndex / 2);
  const semester = termIndex % 2 === 0 ? 1 : 2;
  return `${year}-${semester}`;
}

function isTermInDisplayRange(profile, term) {
  const match = String(term || "").match(/^(\d{4})-[12]$/);
  if (!match) return false;
  const year = Number(match[1]);
  const startYear = Number(profile.admissionYear || 2020);
  return year >= startYear && year <= startYear + 3;
}

function buildPoomEvidence(profile) {
  const templates = {
    character: ["성균 인성 리더십 워크숍", "학생성공센터", 8],
    global: ["글로벌 버디 프로그램", "국제처", 20],
    creativity: ["학생 아이디어톤", "학생성공센터", 12],
    ai: ["AI 기초역량 온라인 과정", "교육개발센터", 10],
    internship: ["현장실습 사전교육", "Co-op위원회", 6],
  };
  return (profile.poom || [])
    .filter((item) => item.completed)
    .map((item, index) => {
      const [title, organizer, hours] = templates[item.id] || [`${item.label} 인증 프로그램`, "성균관대학교", 8];
      return {
        id: `CS-${profile.studentNumber}-${item.id}`,
        title,
        organizer,
        completedAt: `${profile.admissionYear + Math.floor(index / 2)}-${String((index * 3 + 4) % 12 || 12).padStart(2, "0")}-15`,
        hours,
        status: "이수",
        certificationArea: item.label,
        requirementIds: ["poom"],
        source: "챌린지스퀘어 샘플",
      };
    });
}

export function ensureEvidenceData(profile) {
  if (!profile) return profile;
  if (profile.id === "TEST_P01_CHEM_SEMI" && (!Array.isArray(profile.courses) || !profile.courses.some((course) => course.code === "SCM3001"))) {
    profile.courses = JSON.parse(JSON.stringify(LEGACY_PERSONAS.chemSemi.courses));
  }
  if (profile.id === "TEST_P02_LIB_ECON" && (!Array.isArray(profile.courses) || !profile.courses.some((course) => course.code === "ECO2004"))) {
    profile.courses = JSON.parse(JSON.stringify(LEGACY_PERSONAS.libEcon.courses));
  }
  if (profile.id === "TEST_P04_SW_EARLY" && (!Array.isArray(profile.courses) || profile.courses.length < 20)) {
    profile.courses = JSON.parse(JSON.stringify(LEGACY_PERSONAS.softwareEarly.courses));
  }
  const grades = ["A+", "A0", "B+", "A+", "B0", "A0", "B+", "A0"];
  profile.courses = (profile.courses || [])
    .filter((course) => !isSyntheticCourse(course))
    .map((course, index) => normalizePrimaryMajorArea(normalizeOfficialCourse({
        ...course,
        id: course.id || `GLS-${profile.studentNumber}-${course.code || index}`,
        term: isTermInDisplayRange(profile, course.term) ? course.term : getSampleCourseTerm(profile, index),
        grade: course.grade || (course.completed ? grades[index % grades.length] : "예정"),
        source: course.source || "GLS 등록 과목",
        requirementIds: course.requirementIds || inferCourseRequirements(course),
      })));
  supplementCourseEvidence(profile);
  profile.courses = profile.courses.map((course) => annotateCourseMetadata(course, profile));
  profile.nonCurricular = Array.isArray(profile.nonCurricular) ? profile.nonCurricular : buildPoomEvidence(profile);
  profile.evidenceImports = Array.isArray(profile.evidenceImports)
    ? profile.evidenceImports
    : [
        {
          id: `IMPORT-GLS-${profile.studentNumber}`,
          type: "gls",
          label: "GLS 학업성적표 샘플",
          importedAt: "2026-07-14T09:00:00.000Z",
          itemCount: profile.courses.filter((course) => course.completed).length,
        },
        {
          id: `IMPORT-CS-${profile.studentNumber}`,
          type: "challenge",
          label: "챌린지스퀘어 이수내역 샘플",
          importedAt: "2026-07-14T09:05:00.000Z",
          itemCount: profile.nonCurricular.length,
        },
      ];
  return profile;
}

export function getEvidenceForRequirement(profile, requirementId) {
  ensureEvidenceData(profile);
  const courses = profile.courses.filter(
    (course) => course.completed && (course.requirementIds || []).includes(requirementId),
  );
  const programs = profile.nonCurricular.filter((program) => (program.requirementIds || []).includes(requirementId));
  return {
    courses,
    programs,
    credits: courses.reduce((sum, course) => sum + Number(course.credits || 0), 0),
  };
}

export function getPoomCount(profile) {
  return profile.poom.filter((item) => item.completed).length;
}

export function getRequirementItems(profile) {
  const items = [
    {
      id: "registration",
      label: "등록학기",
      description: profile.requiredSemesters
        ? `${profile.department} 교육과정은 ${profile.requiredSemesters}학기 이상 등록`
        : profile.earlyGraduation
          ? "조기졸업은 6~7학기 등록 기준"
          : "일반졸업은 8학기 이상 등록",
      completed: profile.currentSemester,
      required: profile.requiredSemesters || (profile.earlyGraduation ? 6 : 8),
      suffix: "학기",
    },
    {
      id: "gpa",
      label: "졸업 평점",
      description: profile.earlyGraduation ? "일반 조기졸업 샘플 기준 4.00 이상" : "총평점평균 2.50 이상",
      completed: profile.gpa,
      required: profile.earlyGraduation ? 4 : 2.5,
      suffix: "점",
    },
    {
      id: "totalCredits",
      label: "총 졸업학점",
      description: `${profile.campus}·${profile.department} 기준`,
      ...profile.totalCredits,
      suffix: "학점",
    },
    {
      id: "coreGeneral",
      label: "중점교양",
      description: `${profile.admissionYear}학번 적용 기준`,
      ...profile.coreGeneral,
      suffix: "학점",
    },
    {
      id: "balancedGeneral",
      label: "균형교양",
      description: "영역 수와 학점을 함께 확인",
      ...profile.balancedGeneral,
      suffix: "학점",
    },
    {
      id: "dsEducation",
      label: "DS 교육과정",
      description: profile.dsEducation.detail || "입학연도·학과별 지정과목 확인",
      ...profile.dsEducation,
      suffix: "학점",
    },
    {
      id: "primaryMajor",
      label: "제1전공",
      description: profile.primaryMajor.detail,
      ...profile.primaryMajor,
      suffix: "학점",
    },
  ];

  if (profile.secondaryMajor) {
    items.push({
      id: "secondaryMajor",
      label:
        profile.degreeType === "linked_major"
          ? "연계전공"
          : profile.degreeType === "convergence_track"
            ? "융합트랙"
            : "제2전공",
      description: profile.secondaryMajor.detail,
      ...profile.secondaryMajor,
      suffix: "학점",
    });
  }

  if (profile.admissionYear >= 2024) {
    items.push(
      {
        id: "internationalTotal",
        label: "국제어수업 전체",
        description: "2024학번 이후 내국인 신입생 적용",
        ...profile.internationalTotal,
        suffix: "학점",
      },
      {
        id: "internationalMajor",
        label: "전공 국제어수업",
        description: "전체 국제어수업 의무학점에 포함",
        ...profile.internationalMajor,
        suffix: "학점",
      },
    );
  }

  if (profile.specialRequirement) {
    items.push({ ...profile.specialRequirement });
  }

  items.push(
    {
      id: "poom",
      label: "3품 인증",
      description: "인성·글로벌·창의·AI·인턴십 중 3개 인증",
      completed: getPoomCount(profile),
      required: 3,
      suffix: "개",
    },
    {
      id: "graduationEvaluation",
      label: "졸업평가",
      description: profile.graduationEvaluation.label,
      completed: profile.graduationEvaluation.completed,
      required: profile.graduationEvaluation.required,
      suffix: "단계",
    },
  );

  return items;
}

export function getStatus(item) {
  const ratio = getCompletionRatio(item);
  if (ratio >= 1) return "complete";
  if (ratio >= 0.7) return "warning";
  return "danger";
}

export function getCompletionRatio(item) {
  if (item.exception && item.required <= 0) return 1;
  if (item.required <= 0) return 0;
  return Math.min(item.completed / item.required, 1);
}

export function calculateProgress(profile) {
  const items = getRequirementItems(profile);
  const total = items.reduce((sum, item) => sum + getCompletionRatio(item), 0);
  return Math.round((total / items.length) * 100);
}

function getExpectedGraduationLabel(profile, extraSemesters = 0) {
  const required = Number(profile.requiredSemesters || (profile.earlyGraduation ? 6 : 8));
  const remaining = Math.max(0, required - Number(profile.currentSemester || 0)) + extraSemesters;
  if (!remaining) return "요건 충족 후 현재 학기";
  const targetIndex = Number(profile.currentSemester || 0) + remaining - 1;
  const year = Number(profile.admissionYear || 2024) + Math.floor(targetIndex / 2);
  const semester = targetIndex % 2 === 0 ? 1 : 2;
  return `${year}학년도 ${semester}학기`;
}

export function getWhatIfScenarios(profile) {
  const scenarios = [];
  if (profile.secondaryMajor) {
    const programLabel = profile.degreeType === "convergence_track"
      ? "융합트랙 포기"
      : profile.degreeType === "linked_major"
        ? "연계전공 포기"
        : "복수전공 포기";
    scenarios.push({
      id: "drop-secondary",
      label: programLabel,
      description: `${profile.secondaryProgram}을 이수하지 않는 경우`,
    });
  }
  if (profile.specialRequirement?.id === "microdegree") {
    scenarios.push({
      id: "pause-microdegree",
      label: "마이크로디그리 중단",
      description: "별도 인증 과정을 졸업계획에서 제외하는 경우",
    });
  }
  if (profile.specialRequirement?.id === "challengeSemester") {
    scenarios.push({
      id: "remove-challenge",
      label: "도전학기 미참여",
      description: "계획한 도전학기 연구학점을 취득하지 않는 경우",
    });
  }
  if (profile.specialRequirement?.id === "teachingCertificate") {
    scenarios.push({
      id: "pause-teaching",
      label: "교원자격 취득 보류",
      description: "학위 진단과 교원자격 활동을 분리해서 보는 경우",
    });
  }
  if (profile.earlyGraduation) {
    scenarios.push({
      id: "regular-graduation",
      label: "일반졸업 전환",
      description: "조기졸업 계획을 8학기 졸업으로 바꾸는 경우",
    });
  }
  scenarios.push({
    id: "leave-semester",
    label: "한 학기 휴학",
    description: "다음 학기를 휴학해 졸업시점이 한 학기 늦어지는 경우",
  });
  return scenarios;
}

export function simulateWhatIf(profile, scenarioId) {
  const simulated = JSON.parse(JSON.stringify(profile));
  const baselineItems = getRequirementItems(profile);
  let extraSemesters = 0;
  let headline = "";
  let explanation = "";

  if (scenarioId === "drop-secondary" && simulated.secondaryMajor) {
    headline = `${simulated.secondaryProgram} 제외`;
    explanation = "제2전공 학점과 별도 확인 항목이 진단에서 빠집니다. 이미 취득한 과목은 총 졸업학점에서 유지됩니다.";
    simulated.secondaryMajor = null;
    simulated.creditBreakdown.secondaryMajor = [];
    simulated.degreeType = "single_major";
    simulated.degreeTypeLabel = "단일전공";
    simulated.secondaryProgram = "없음";
    if (simulated.specialRequirement?.id === "secondaryInternationalCheck") simulated.specialRequirement = null;
    if (simulated.graduationEvaluation?.checklist?.length > 2) {
      simulated.graduationEvaluation = {
        completed: 1,
        required: 2,
        label: `${simulated.department} 졸업평가`,
        description: "제1전공의 졸업평가만 남긴 가정입니다.",
        checklist: simulated.graduationEvaluation.checklist.slice(0, 2),
      };
    }
  } else if (scenarioId === "pause-microdegree") {
    headline = "마이크로디그리 제외";
    explanation = "마이크로디그리는 졸업요건이 아니므로 제1전공과 총 졸업학점 기준은 그대로 유지됩니다.";
    simulated.specialRequirement = null;
    simulated.secondaryProgram = "없음";
  } else if (scenarioId === "remove-challenge") {
    const credits = Number(simulated.whatIfData?.challengeCredits || 0);
    headline = "도전학기 미참여";
    explanation = `계획에 반영했던 도전학기 ${credits}학점을 제외했습니다. 졸업논문연구 자체는 별도로 남습니다.`;
    simulated.specialRequirement = null;
    simulated.totalCredits.completed = Math.max(0, simulated.totalCredits.completed - credits);
    simulated.primaryMajor.completed = Math.max(0, simulated.primaryMajor.completed - credits);
  } else if (scenarioId === "pause-teaching") {
    headline = "교원자격 활동 분리";
    explanation = "교직인적성·응급처치 등 교원자격 발급 활동만 진단에서 분리합니다. 실제 학위요건과의 관계는 사범대 확인이 필요합니다.";
    simulated.specialRequirement = null;
  } else if (scenarioId === "regular-graduation") {
    headline = "8학기 일반졸업";
    explanation = "조기졸업의 6~7학기·평점 기준 대신 일반졸업 등록학기 기준으로 비교합니다.";
    simulated.earlyGraduation = false;
    simulated.requiredSemesters = 8;
  } else {
    headline = "한 학기 휴학";
    explanation = "학점과 현재 충족 상태는 바뀌지 않지만 예상 졸업시점이 한 학기 늦어집니다.";
    extraSemesters = 1;
  }

  const resultItems = getRequirementItems(simulated);
  const beforeMap = new Map(baselineItems.map((item) => [item.id, item]));
  const afterMap = new Map(resultItems.map((item) => [item.id, item]));
  const changes = [...new Set([...beforeMap.keys(), ...afterMap.keys()])]
    .map((id) => {
      const before = beforeMap.get(id);
      const after = afterMap.get(id);
      if (!after) return `${before.label} 진단 제외`;
      if (!before) return `${after.label} 진단 추가`;
      if (before.required !== after.required || before.completed !== after.completed) {
        return `${after.label} ${formatNumber(before.completed)}/${formatNumber(before.required)} → ${formatNumber(after.completed)}/${formatNumber(after.required)}${after.suffix}`;
      }
      return null;
    })
    .filter(Boolean);

  return {
    headline,
    explanation,
    before: {
      progress: calculateProgress(profile),
      pending: baselineItems.filter((item) => item.completed < item.required).length,
      graduation: getExpectedGraduationLabel(profile),
    },
    after: {
      progress: calculateProgress(simulated),
      pending: resultItems.filter((item) => item.completed < item.required).length,
      graduation: getExpectedGraduationLabel(simulated, extraSemesters),
    },
    changes: changes.length ? changes : ["학점·요건 수치는 동일하며 예상 졸업시점만 변경"],
  };
}

export function getActionItems(profile) {
  return getRequirementItems(profile)
    .filter((item) => item.completed < item.required)
    .sort((a, b) => getCompletionRatio(b) - getCompletionRatio(a))
    .slice(0, 5)
    .map((item) => ({
      title: `${item.label} ${formatNumber(item.required - item.completed)}${item.suffix} 부족`,
      detail: item.description,
      id: item.id,
    }));
}

function makeCreditSection(id, label, value, children = []) {
  if (!value) return null;
  return {
    id,
    label,
    completed: Number(value.completed || 0),
    required: Number(value.required || 0),
    remaining: Math.max(0, Number(value.required || 0) - Number(value.completed || 0)),
    children: children.map((item) => ({
      ...item,
      completed: Number(item.completed || 0),
      required: Number(item.required || 0),
      remaining: Math.max(0, Number(item.required || 0) - Number(item.completed || 0)),
    })),
  };
}

export function getCreditGapSummary(profile) {
  const sections = [
    makeCreditSection("totalCredits", "총 졸업학점", profile.totalCredits),
    makeCreditSection("coreGeneral", "중점교양", profile.coreGeneral),
    makeCreditSection("balancedGeneral", "균형교양", profile.balancedGeneral),
    makeCreditSection("dsEducation", "DS 교육과정", profile.dsEducation),
    makeCreditSection("primaryMajor", "제1전공", profile.primaryMajor, profile.creditBreakdown?.primaryMajor || []),
    profile.secondaryMajor
      ? makeCreditSection(
          "secondaryMajor",
          profile.degreeType === "convergence_track" ? "융합트랙" : profile.degreeType === "linked_major" ? "연계전공" : "제2전공",
          profile.secondaryMajor,
          profile.creditBreakdown?.secondaryMajor || [],
        )
      : null,
    profile.admissionYear >= 2024 ? makeCreditSection("internationalTotal", "국제어수업 전체", profile.internationalTotal) : null,
    profile.admissionYear >= 2024 ? makeCreditSection("internationalMajor", "전공 국제어수업", profile.internationalMajor) : null,
  ].filter(Boolean);

  const detailedGaps = sections.flatMap((section) => {
    const children = section.children.filter((item) => item.remaining > 0);
    if (children.length) return children.map((item) => ({ ...item, parent: section.label }));
    return section.remaining > 0 && section.id !== "totalCredits" ? [{ ...section, parent: "졸업요건" }] : [];
  });

  const priority = detailedGaps
    .filter((item) => !["국제어수업 전체"].includes(item.label))
    .sort((a, b) => b.remaining - a.remaining)[0];
  const totalRemaining = sections.find((section) => section.id === "totalCredits")?.remaining || 0;
  const advice = priority
    ? `다음 학기는 ${priority.label} ${formatNumber(priority.remaining)}학점 보완을 우선 확인하세요. 총 졸업학점은 ${formatNumber(totalRemaining)}학점 남았습니다.`
    : totalRemaining > 0
      ? `세부 필수영역은 대부분 충족 상태입니다. 총 졸업학점 ${formatNumber(totalRemaining)}학점은 일반선택 또는 전공선택으로 채우는 계획을 확인하세요.`
      : "학점 기준은 현재 충족 상태입니다. 남은 졸업평가·3품·공식 공지만 확인하세요.";

  return { sections, detailedGaps, advice };
}

const COURSE_RECOMMENDATION_CATALOG = {
  TEST_P01_CHEM_SEMI: [
    { code: "ECH3016", name: "분리공정", credits: 3, target: "전공코어", semester: "3학년 권장", reason: "부족한 화학공학 전공코어를 우선 보완" },
    { code: "ECH3053", name: "반응공학", credits: 3, target: "전공코어", semester: "3학년 권장", reason: "후속 설계 교과목의 기초가 되는 전공코어" },
    { code: "EAM4019", name: "전자 패키지공학", credits: 3, target: "융합트랙", semester: "3~4학년 권장", reason: "공정·소재·패키징 심화 부족분 보완" },
    { code: "ECH4017", name: "플라즈마공정및응용", credits: 3, target: "융합트랙", semester: "4학년 권장", reason: "반도체 공정 심화 영역 보완" },
  ],
  TEST_P02_LIB_ECON: [
    { code: "LIS2015", name: "메타데이터론", credits: 3, target: "제1전공", semester: "2~3학년 권장", reason: "문헌정보학 전공 부족분 보완" },
    { code: "ECO3005", name: "재정학", credits: 3, target: "제2전공", semester: "3~4학년 권장", reason: "경제학 복수전공 선택·심화 학점 보완" },
    { code: "ECO3006", name: "산업조직론", credits: 3, target: "제2전공", semester: "3~4학년 권장", reason: "경제학 복수전공 선택·심화 학점 보완" },
  ],
  TEST_P03_GLB_BIZ: [
    { code: "GBA2035", name: "IT Management", credits: 3, target: "전공선택", semester: "1~2학년 권장", reason: "전공선택과 국제어수업 부족분을 함께 보완할 수 있는 후보" },
    { code: "GBA2037", name: "Business Statistics", credits: 3, target: "전공선택", semester: "1~2학년 권장", reason: "경영 데이터 분석 역량과 전공학점 보완" },
    { code: "GBA3034", name: "Business Communication", credits: 3, target: "전공선택", semester: "2학년 권장", reason: "전공학점과 국제어수업 부족분을 함께 보완할 수 있는 후보" },
  ],
  TEST_P04_SW_EARLY: [
    { code: "AIM4003", name: "자연어처리개론", credits: 3, target: "전공심화 후보", semester: "3~4학년 권장", reason: "부족한 전공심화 6학점 중 3학점 보완 후보" },
    { code: "ECE4249", name: "컴퓨터비전", credits: 3, target: "전공심화 후보", semester: "3~4학년 권장", reason: "AI 응용 분야 전공심화 보완 후보" },
    { code: "CSE3036", name: "컴퓨터공학세미나", credits: 1, target: "전공 후보", semester: "3~4학년 권장", reason: "총 졸업학점의 소규모 부족분 보완 후보" },
  ],
  TEST_P05_ECON_DOUBLE: [
    { code: "ECO2003", name: "미시경제학", credits: 3, target: "경제학 전공", semester: "2~3학년", reason: "경제학과 교육과정의 기초 전공 후보" },
    { code: "MCJ2040", name: "메타버스와콘텐츠비즈니스", credits: 3, target: "제2전공", semester: "2~3학년", reason: "미디어커뮤니케이션 복수전공 학점 보완" },
  ],
  TEST_P06_MEDIA_MICRO: [
    { code: "MCJ3131", name: "인터컬쳐럴커뮤니케이션", credits: 3, target: "마이크로디그리", semester: "3~4학년", reason: "9학점 마이크로디그리의 남은 과목 후보" },
  ],
  TEST_P07_DESIGN: [
    { code: "DES3045", name: "UXUI디자인1", credits: 3, target: "디자인 전공", semester: "3~4학년", reason: "졸업 프로젝트 전 실무 역량 보완" },
    { code: "DES4001", name: "융합캡스톤디자인", credits: 3, target: "졸업 프로젝트", semester: "4학년", reason: "전시 결과물과 팀 프로젝트 연결" },
    { code: "DES3048", name: "디자인앤포트폴리오", credits: 3, target: "포트폴리오", semester: "3~4학년", reason: "개인 포트폴리오 준비 과목" },
  ],
  TEST_P08_CHEM_CHALLENGE: [
    { code: "CHY3037", name: "화학개별연구4", credits: 2, target: "학부 연구", semester: "2~3학년", reason: "연구실 경험을 졸업논문 연구로 연결" },
    { code: "CHY3021", name: "졸업논문연구", credits: 2, target: "졸업평가", semester: "4학년", reason: "학부 졸업논문 준비 필수 확인 과목" },
  ],
  TEST_P09_PHARMACY: [
    { code: "PHR3016", name: "약학연구2", credits: 5, target: "심화실무실습", semester: "5~6학년", reason: "2022학번 이후 졸업평가 선택 경로" },
  ],
  TEST_P10_EDUCATION: [
    { code: "EDU2009", name: "교육평가", credits: 3, target: "교육학 전공", semester: "2~3학년", reason: "사범대 기본이수과목 보완" },
    { code: "CFTD064", name: "교육학교재연구및지도법", credits: 3, target: "교과교육", semester: "3~4학년", reason: "교원자격 기본이수과목 보완" },
    { code: "CFTD079", name: "교육학교과논리논술", credits: 2, target: "교과교육", semester: "3~4학년", reason: "교원자격 교과교육영역 보완" },
  ],
};

const POOM_ACTION_CATALOG = {
  character: { title: "인성·리더십 또는 봉사 프로그램", detail: "챌린지스퀘어에서 인성 영역으로 표시된 프로그램을 신청하고 최종 인증 상태를 확인", href: "https://chsquare.skku.edu/challenge/nxui/index.html" },
  global: { title: "교환학생·글로벌 버디·국제행사", detail: "글로벌 영역 인정 프로그램의 활동시간과 증빙 제출 조건을 먼저 확인", href: "https://chsquare.skku.edu/challenge/nxui/index.html" },
  creativity: { title: "창의·융합 프로젝트 또는 공모전", detail: "프로젝트형 비교과를 이수한 뒤 창의 영역 인정 여부를 챌린지스퀘어에서 확인", href: "programs.html" },
  ai: { title: "AI 비교과 또는 AICE 과정", detail: "AI 역량 프로그램 이수 후 수료증과 챌린지스퀘어 인증 상태를 함께 확인", href: "programs.html" },
  internship: { title: "Co-op·현장실습 프로그램", detail: "현장실습지원센터에서 전공 연계 실습을 찾고 3품 인정 조건을 신청 전에 확인", href: "https://tollgate.skku.edu/" },
};

export function getPersonalizedStudyPlan(profile) {
  const gapSummary = getCreditGapSummary(profile);
  const completedCodes = new Set(profile.courses.filter((course) => course.completed).map((course) => course.code));
  const catalog = COURSE_RECOMMENDATION_CATALOG[profile.id] || [];
  const courses = catalog
    .filter((course) => !completedCodes.has(course.code))
    .slice(0, 4)
    .map((course) => ({
      ...course,
      sourceUrl: profile.id === "TEST_P04_SW_EARLY"
        ? "https://skb.skku.edu/sw/under_sw_curriculum.do"
        : profile.id === "TEST_P01_CHEM_SEMI"
          ? "https://cheme.skku.edu/undergraduate-course-offerings/"
          : profile.id === "TEST_P03_GLB_BIZ"
            ? "https://skb.skku.edu/gba/curriculum.do?lang=All&pager.offset=60"
            : profile.sourceUrl || "https://ibook.skku.edu/Viewer/OCFDOM5VH4A2",
    }));
  const poomActions = getPoomCount(profile) >= 3
    ? []
    : profile.poom
        .filter((item) => !item.completed)
        .map((item) => ({ area: item.label, ...(POOM_ACTION_CATALOG[item.id] || POOM_ACTION_CATALOG.creativity) }));
  const courseCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const totalGap = Math.max(0, profile.totalCredits.required - profile.totalCredits.completed);
  const roadmap = [
    { label: "현재", title: "부족 영역 확인", detail: gapSummary.detailedGaps.slice(0, 2).map((item) => `${item.label} ${formatNumber(item.remaining)}학점`).join(" · ") || "학점 기준 충족" },
    { label: "다음 학기", title: `${courses.length}개 과목 우선 검토`, detail: courses.length ? `${courses.slice(0, 3).map((course) => course.name).join(" · ")} (${courseCredits}학점 후보)` : "수강편람에서 전공선택 과목 확인" },
    { label: "졸업 전", title: "3품·졸업평가 마무리", detail: poomActions.length ? `${poomActions.map((item) => item.area).join(" · ")} 중 필요한 인증 선택` : "3품 입력 기준 충족 · 졸업평가 확인" },
  ];
  return { courses, poomActions, roadmap, totalGap, sourceUrl: profile.sourceUrl || "https://ibook.skku.edu/Viewer/OCFDOM5VH4A2" };
}

export function getNextSemesterPlan(profile) {
  const plan = [];
  const remainingCourses = profile.courses.filter((course) => !course.completed);

  remainingCourses.slice(0, 3).forEach((course) => {
    plan.push({
      type: "course",
      title: `${course.name} 수강 검토`,
      detail: `${course.area} ${course.credits}학점 · 실제 개설 여부와 선수과목을 수강편람에서 확인`,
      priority: 80,
    });
  });

  if (profile.admissionYear >= 2024 && profile.internationalMajor.completed < profile.internationalMajor.required) {
    const gap = profile.internationalMajor.required - profile.internationalMajor.completed;
    plan.push({
      type: "language",
      title: `전공 국제어수업 ${gap}학점 확보`,
      detail: "다음 학기 전공 과목 중 국제어수업 표기가 있는 분반을 우선 탐색",
      priority: 90,
    });
  }

  if (getPoomCount(profile) < 3) {
    const pending = profile.poom.filter((item) => !item.completed).map((item) => item.label);
    plan.push({
      type: "program",
      title: `미완료 인증 프로그램 탐색`,
      detail: `${pending.join("·")} 중 일정과 인정시간이 맞는 비교과를 선택`,
      priority: 95,
      href: "programs.html",
    });
  }

  const nextEvaluation = profile.graduationEvaluation.checklist.find((item) => !item.completed);
  if (nextEvaluation) {
    plan.push({
      type: "evaluation",
      title: nextEvaluation.label,
      detail: `${profile.graduationEvaluation.label}의 다음 미완료 단계 · 학과 공지 일정 확인`,
      priority: 100,
    });
  }

  return plan.sort((a, b) => b.priority - a.priority).slice(0, 4);
}

export function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function getProfileMetadata(profile) {
  ensureEvidenceData(profile);
  const evidenceTypes = [...new Set((profile.evidenceImports || []).map((item) => item.type))];
  const latestEvidenceAt = (profile.evidenceImports || [])
    .map((item) => item.importedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  return {
    admissionYear: profile.admissionYear,
    campus: profile.campus,
    department: profile.department,
    degreeType: profile.degreeType,
    degreeTypeLabel: profile.degreeTypeLabel,
    secondaryProgram: profile.secondaryProgram,
    evidenceTypes,
    latestEvidenceAt,
    documentRefreshPlan: "학사요건 문서는 학년도 단위로 재등록하고, 유지되는 규칙은 보존하며 변경된 규칙만 갱신합니다.",
  };
}

export function getQuestionMetadata(question, profile) {
  const text = String(question || "");
  const years = [...new Set(text.match(/20\d{2}/g) || [])].map(Number);
  const documentTypes = [
    text.includes("성적") || text.toLowerCase().includes("gls") ? "gls" : null,
    text.includes("비교과") || text.includes("3품") || text.includes("챌린지") ? "challenge" : null,
    text.includes("로드맵") || text.includes("교육과정") || text.includes("졸업요건") ? "requirements" : null,
  ].filter(Boolean);

  return {
    requestedYears: years.length ? years : [profile.admissionYear],
    requestedDepartment: text.includes(profile.department) ? profile.department : profile.department,
    requestedDocumentTypes: documentTypes.length ? documentTypes : ["requirements"],
  };
}

export function getAssistantMetadataContext(question, profile) {
  const profileMetadata = getProfileMetadata(profile);
  const questionMetadata = getQuestionMetadata(question, profile);
  const matchedSources = OFFICIAL_SOURCES.slice(0, 5).map((source) => ({
    label: source.label,
    url: source.url,
  }));

  return {
    profileMetadata,
    questionMetadata,
    matchedSources,
  };
}

function getPrimaryMajorBreakdownText(profile) {
  const items = profile.creditBreakdown?.primaryMajor || [];
  if (!items.length) return "";
  return items
    .map((item) => {
      const remaining = Math.max(0, Number(item.required || 0) - Number(item.completed || 0));
      const suffix = remaining > 0 ? `, ${formatNumber(remaining)}학점 부족` : ", 충족";
      return `- ${item.label}: ${formatNumber(item.completed)}/${formatNumber(item.required)}학점${suffix}`;
    })
    .join("\n");
}

function getDsPolicyText(profile) {
  const dsRule = getDsRuleForAdmissionYear(profile.admissionYear);
  if (!dsRule) return "DS 교육과정은 입학연도별 기준이 달라 최신 학번별 표를 함께 확인해야 합니다.";
  if (profile.admissionYear >= 2025) {
    return "2025학번은 DS기반 필수 과목 체계가 개편되어 데이터분석과AI기초가 공통 필수이고, 계열·학과에 따라 공학컴퓨터프로그래밍/프로그래밍기초와실습 인정 방식이 달라집니다.";
  }
  if (profile.admissionYear <= 2020) {
    return "2020학번 이전 기준은 학과별 지정 DS 과목을 우선 확인해야 하며, 소프트웨어·공학 계열 샘플은 공학컴퓨터프로그래밍/프로그래밍기초와실습을 DS기반 과목으로 연결합니다.";
  }
  return "2021~2024학번은 AI기초와활용 및 데이터분석기초 계열 과목이 공통 필수이고, 공학·소프트웨어 계열은 공학컴퓨터프로그래밍/프로그래밍기초와실습을 학과 지정 DS기반 과목으로 확인해야 합니다.";
}

export function getLocalAnswer(question, profile) {
  const normalized = question.replace(/\s/g, "").toLowerCase();
  const actions = getActionItems(profile);
  const studyPlan = getPersonalizedStudyPlan(profile);
  const primaryMajorBreakdown = getPrimaryMajorBreakdownText(profile);
  const isDsQuestion = normalized.includes("ds") || normalized.includes("디에스") || normalized.includes("공학컴퓨터") || normalized.includes("프로그래밍기초");

  if (!isDsQuestion && (normalized.includes("수업") || normalized.includes("과목") || normalized.includes("로드맵") || normalized.includes("수강"))) {
    const courses = studyPlan.courses.length
      ? studyPlan.courses.map((course, index) => `${index + 1}. ${course.code} ${course.name} (${course.target}, ${course.credits}학점) - ${course.reason}`).join("\n")
      : "현재 저장된 프로필에서는 우선 추천할 미이수 과목이 없습니다.";
    const breakdown = primaryMajorBreakdown ? `\n\n제1전공 세부 현황\n${primaryMajorBreakdown}` : "";
    return `${profile.department} ${profile.admissionYear}학번의 부족 영역과 전공 로드맵을 연결한 수강 후보입니다.${breakdown}\n\n${courses}\n\n전공 과목은 전공코어, 전공심화, 실험실습 중 어디에 해당하는지 함께 확인해서 추천합니다. 실제 전공 인정, 개설 학기, 선수과목은 수강신청 전 GLS 수강편람과 학과 교육과정에서 최종 확인해 주세요.`;
  }

  if (normalized.includes("부족") || normalized.includes("뭐해야") || normalized.includes("무엇을")) {
    const summary = actions.length
      ? actions.map((item, index) => `${index + 1}. ${item.title} - ${item.detail}`).join("\n")
      : "현재 입력된 항목은 모두 충족으로 표시됩니다.";
    const breakdown = actions.some((item) => item.id === "primaryMajor") && primaryMajorBreakdown
      ? `\n\n제1전공 세부 구분\n${primaryMajorBreakdown}`
      : "";
    return `${profile.name}님의 현재 입력값 기준 우선 확인할 항목입니다.\n\n${summary}${breakdown}\n\n최종 졸업 판정은 학과사무실과 GLS에서 다시 확인해 주세요.`;
  }

  if (normalized.includes("조기졸업")) {
    const semesterPass = profile.currentSemester >= 6 && profile.currentSemester <= 7;
    const gpaGap = Math.max(0, 4 - profile.gpa);
    const creditGap = Math.max(0, profile.totalCredits.required - profile.totalCredits.completed);
    return `일반 조기졸업 샘플 기준으로 6~7학기, GPA 4.00 이상, 전체 졸업요건 충족을 확인합니다.\n\n- 등록학기: ${profile.currentSemester}학기 (${semesterPass ? "범위 충족" : "확인 필요"})\n- GPA: ${profile.gpa.toFixed(2)} (${gpaGap === 0 ? "충족" : `${gpaGap.toFixed(2)}점 부족`})\n- 총학점: ${profile.totalCredits.completed}/${profile.totalCredits.required} (${creditGap === 0 ? "충족" : `${creditGap}학점 부족`})\n\n학부-대학원 연계과정은 별도 기준이 적용될 수 있습니다.`;
  }

  if (normalized.includes("3품") || normalized.includes("인증")) {
    const completed = profile.poom.filter((item) => item.completed).map((item) => item.label);
    const pending = profile.poom.filter((item) => !item.completed).map((item) => item.label);
    const activities = studyPlan.poomActions.map((item) => `- ${item.area}: ${item.title} - ${item.detail}`).join("\n");
    return `현재 3품 인정 영역 중 ${completed.length}개가 완료로 입력되어 있습니다.\n\n완료: ${completed.join(", ") || "없음"}\n미완료: ${pending.join(", ") || "없음"}\n\n${activities || "현재 입력 기준으로 추가 활동 추천이 필요하지 않습니다."}\n\n졸업을 위해 총 3개 인증이 필요하며, 실제 인정 상태는 챌린지스퀘어에서 확인해야 합니다.`;
  }

  if (isDsQuestion) {
    const dsPolicy = getDsPolicyText(profile);
    const dsCourses = profile.courses
      .filter((course) => (course.requirementIds || []).includes("dsEducation") || (course.badges || []).some((badge) => badge.includes("DS")))
      .map((course) => `- ${course.code} ${course.name} (${course.credits}학점): ${(course.badges || []).join(", ") || course.area}`)
      .join("\n");
    if (profile.dsEducation.exception) {
      return `${profile.department} ${profile.admissionYear}학번에는 학과 지정 DS 과목 예외가 적용됩니다.\n\n${dsPolicy}\n\n현재 DS 연결 과목\n${dsCourses || "- 아직 연결된 DS 과목이 없습니다."}\n\n현재 인정 상태: ${profile.dsEducation.completed}/${profile.dsEducation.required}학점입니다. 일반 DS 기본과목명이 아니라 학번·계열·학과 지정 과목 이수 여부로 판정합니다. 최종 인정은 GLS와 학과 교육과정표에서 확인해 주세요.`;
    }
    return `현재 DS 교육과정은 ${profile.dsEducation.completed}/${profile.dsEducation.required}학점으로 입력되어 있습니다.\n\n${dsPolicy}\n\n현재 DS 연결 과목\n${dsCourses || "- 아직 연결된 DS 과목이 없습니다."}\n\n입학연도와 학과에 따라 지정 과목이 달라질 수 있으므로 최신 교육과정표를 함께 확인해 주세요.`;
  }

  if (normalized.includes("전공") || normalized.includes("학점")) {
    const secondary = profile.secondaryMajor
      ? `\n- ${profile.degreeType === "linked_major" ? "연계전공" : profile.degreeType === "convergence_track" ? "융합트랙" : "제2전공"}: ${profile.secondaryMajor.completed}/${profile.secondaryMajor.required}학점`
      : "";
    const candidates = studyPlan.courses.slice(0, 3).map((course) => `${course.code} ${course.name}`).join(", ");
    const breakdown = primaryMajorBreakdown ? `\n\n제1전공 세부 구분\n${primaryMajorBreakdown}` : "";
    return `전공 이수 현황입니다.\n\n- 제1전공: ${profile.primaryMajor.completed}/${profile.primaryMajor.required}학점${secondary}\n- 총 졸업학점: ${profile.totalCredits.completed}/${profile.totalCredits.required}학점${breakdown}\n\n- 우선 수강 후보: ${candidates || "현재 추천 후보 없음"}\n\n복수전공·연계전공 학생은 각 전공의 졸업평가도 함께 확인해야 합니다.`;
  }

  if (normalized.includes("졸업평가") || normalized.includes("논문") || normalized.includes("시험")) {
    const checklist = profile.graduationEvaluation.checklist
      .map((item) => `- ${item.completed ? "완료" : "미완료"}: ${item.label}`)
      .join("\n");
    return `${profile.graduationEvaluation.description}\n\n${checklist}\n\n세부 일정과 제출 형식은 해당 학기 학과 공지를 확인해 주세요.`;
  }

  return `${profile.department} ${profile.admissionYear}학번 프로필을 기준으로 답변하고 있어요. “지금 부족한 요건”, “조기졸업 가능성”, “3품 현황”, “전공학점”, “졸업평가”처럼 질문하면 현재 입력값과 조사된 규칙을 연결해 안내할 수 있습니다.`;
}
