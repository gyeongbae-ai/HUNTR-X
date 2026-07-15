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
    경영대학: ["글로벌경영학과"],
  },
  자연과학캠퍼스: {
    공과대학: ["화학공학부"],
    소프트웨어융합대학: ["소프트웨어학과"],
  },
};

export const SECONDARY_PROGRAMS = [
  "없음",
  "경제학과 복수전공",
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
    label: "성균관대학교 전공 로드맵",
    url: "https://ibook.skku.edu/Viewer/OCFDOM5VH4A2",
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

export const PERSONAS = {
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
    primaryMajor: { completed: 28, required: 40, detail: "전공코어 36학점 + 실험·실습 4학점" },
    secondaryMajor: { completed: 12, required: 21, detail: "지정과목 21학점 · 원전공과 최대 6학점 인정 · 산학프로젝트 또는 인턴십 권장" },
    creditBreakdown: {
      primaryMajor: [
        { label: "전공코어", completed: 24, required: 36 },
        { label: "실험·실습", completed: 4, required: 4 },
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
      { code: "SCM3001", name: "반도체종합설비기술", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: true, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "SSE2018", name: "반도체소자", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: true, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "SSE3036", name: "반도체공정", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: true, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECH3061", name: "반도체화학공정", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: true, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECH3016", name: "분리공정", area: "전공코어", credits: 3, completed: false },
      { code: "ECH3053", name: "반응공학", area: "전공코어", credits: 3, completed: false },
      { code: "ECH3073", name: "화공종합설계", area: "종합설계", credits: 3, completed: false },
      { code: "EAM2057", name: "신소재공학 개론1", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: false, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "EAM4019", name: "전자 패키지공학", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: false, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECH2032", name: "화공열및물질전달", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: false, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ECH4017", name: "플라즈마공정및응용", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: false, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
      { code: "ASE3004", name: "차세대반도체종합설계", area: "반도체소재부품장비패키징 융합트랙", credits: 3, completed: false, source: "반도체특성화대학지원사업단 교과목 구성", requirementIds: ["totalCredits", "secondaryMajor"] },
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
        { label: "문헌정보 전공코어", completed: 24, required: 30 },
        { label: "문헌정보 전공심화", completed: 6, required: 12 },
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
      description: "문헌정보학과 졸업논문과 경제학과 졸업시험 또는 면제 기준을 모두 충족해야 합니다.",
      checklist: [
        { label: "문헌정보학과 지도교수 배정", completed: true },
        { label: "문헌정보학과 졸업논문 제출", completed: false },
        { label: "문헌정보학과 논문 심사 합격", completed: false },
        { label: "경제학과 지정과목 점수 환산", completed: false },
        { label: "환산점수 315점 또는 시험 통과", completed: false },
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
    notes: ["복수전공자는 두 전공의 졸업평가를 모두 통과해야 합니다.", "경제학과 면제 환산점수는 최신 학과 공지를 확인해야 합니다."],
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
        { label: "전공선택", completed: 6, required: 15 },
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
        { label: "캡스톤·실습", completed: 6, required: 6 },
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
      { code: "GEDT001", name: "성균논어", area: "중점교양", credits: 3, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDT002", name: "창의적글쓰기", area: "중점교양", credits: 3, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDT003", name: "영어커뮤니케이션", area: "중점교양", credits: 3, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDT004", name: "문제해결과논리", area: "중점교양", credits: 3, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDT005", name: "AI기초와활용", area: "중점교양", credits: 3, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDT006", name: "데이터리터러시", area: "중점교양", credits: 3, completed: true, requirementIds: ["totalCredits", "coreGeneral"] },
      { code: "GEDB001", name: "현대사회와윤리", area: "균형교양", credits: 3, completed: true, requirementIds: ["totalCredits", "balancedGeneral"] },
      { code: "GEDB002", name: "과학기술과사회", area: "균형교양", credits: 3, completed: true, requirementIds: ["totalCredits", "balancedGeneral"] },
      { code: "DASF003", name: "공학컴퓨터프로그래밍", area: "DS 학과 지정", credits: 3, completed: true, requirementIds: ["totalCredits", "dsEducation"] },
      { code: "DASF004", name: "프로그래밍기초와실습", area: "DS 학과 지정", credits: 3, completed: true, requirementIds: ["totalCredits", "dsEducation"] },
      { code: "SWE1001", name: "소프트웨어학개론", area: "전공코어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE1002", name: "데이터구조", area: "전공코어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE2001", name: "알고리즘", area: "전공코어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE2002", name: "컴퓨터구조", area: "전공코어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE2003", name: "프로그래밍언어", area: "전공코어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE2004", name: "운영체제", area: "전공코어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE2005", name: "컴퓨터네트워크", area: "전공코어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE2006", name: "소프트웨어공학", area: "전공코어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE3001", name: "시스템프로그래밍", area: "전공심화", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE3002", name: "컴파일러", area: "전공심화", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE3003", name: "데이터베이스개론", area: "전공심화", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE3004", name: "인간컴퓨터상호작용", area: "전공심화", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE3005", name: "소프트웨어테스팅", area: "전공심화", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE3006", name: "오픈소스소프트웨어실습", area: "전공심화", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE3011", name: "인공지능개론", area: "전공국제어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor", "internationalTotal", "internationalMajor"] },
      { code: "SWE3050", name: "기계학습원론", area: "전공국제어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor", "internationalTotal", "internationalMajor"] },
      { code: "SWE3051", name: "컴퓨터비전개론", area: "전공국제어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor", "internationalTotal", "internationalMajor"] },
      { code: "SWE3052", name: "심층신경망개론", area: "전공국제어", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor", "internationalTotal", "internationalMajor"] },
      { code: "SWE4001", name: "소프트웨어종합설계1", area: "캡스톤", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "SWE4002", name: "소프트웨어종합설계2", area: "캡스톤", credits: 3, completed: true, requirementIds: ["totalCredits", "primaryMajor"] },
      { code: "GEDL001", name: "Academic English", area: "국제어교양", credits: 3, completed: true, requirementIds: ["totalCredits", "internationalTotal"] },
      { code: "GEDL002", name: "Global Communication", area: "국제어교양", credits: 3, completed: true, requirementIds: ["totalCredits", "internationalTotal"] },
      { code: "FREE001", name: "확률과통계", area: "일반선택", credits: 3, completed: true, requirementIds: ["totalCredits"] },
      { code: "FREE002", name: "선형대수학", area: "일반선택", credits: 3, completed: true, requirementIds: ["totalCredits"] },
      { code: "FREE003", name: "이산수학", area: "일반선택", credits: 3, completed: true, requirementIds: ["totalCredits"] },
      { code: "FREE004", name: "기술창업론", area: "일반선택", credits: 3, completed: true, requirementIds: ["totalCredits"] },
      { code: "FREE005", name: "산업보안입문", area: "일반선택", credits: 3, completed: true, requirementIds: ["totalCredits"] },
      { code: "FREE006", name: "정보보호개론", area: "일반선택", credits: 3, completed: true, requirementIds: ["totalCredits"] },
      { code: "FREE007", name: "UX디자인기초", area: "일반선택", credits: 3, completed: true, requirementIds: ["totalCredits"] },
      { code: "FREE008", name: "웹프로그래밍실습", area: "일반선택", credits: 3, completed: true, requirementIds: ["totalCredits"] },
      { code: "SWE3032", name: "인공지능프로젝트", area: "일반선택", credits: 2, completed: true, requirementIds: ["totalCredits"] },
      { code: "SWE4991", name: "인턴십현장실습", area: "졸업평가", credits: 0, completed: false, requirementIds: ["graduationEvaluation"] },
    ],
    notes: [
      "2020학번 소프트웨어학과는 일반 DS 기본과목 대신 DASF003·DASF004를 학과 지정 DS 과목으로 적용합니다.",
      "조기졸업이어도 전공 66학점과 학과 졸업평가는 감면되지 않습니다.",
      "6학기 조기졸업은 연구 일정을 4학기 지도교수 연락, 5학기 계획 제출, 6학기 최종보고 순으로 앞당겨야 합니다.",
    ],
  },
};

export function clonePersona(key = "globalBiz") {
  return ensureEvidenceData(JSON.parse(JSON.stringify(PERSONAS[key] || PERSONAS.globalBiz)));
}

function inferCourseRequirements(course) {
  const ids = ["totalCredits"];
  const area = course.area || "";
  if (/DS/.test(area)) ids.push("dsEducation");
  if (/중점교양/.test(area)) ids.push("coreGeneral");
  if (/균형교양/.test(area)) ids.push("balancedGeneral");
  if (/제2전공/.test(area)) ids.push("secondaryMajor");
  if (/전공|I-Core|캡스톤|종합설계/.test(area) && !/제2전공/.test(area)) ids.push("primaryMajor");
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

function getRequirementEvidenceCredits(profile, requirementId) {
  return profile.courses
    .filter((course) => course.completed && (course.requirementIds || []).includes(requirementId))
    .reduce((sum, course) => sum + Number(course.credits || 0), 0);
}

function makeSupplementalCourses(profile, requirementId, missingCredits) {
  const courses = [];
  let remaining = Math.max(0, Math.round(Number(missingCredits || 0) * 10) / 10);
  let index = 0;
  const names = requirementCourseTemplates[requirementId] || [`${requirementAreaLabels[requirementId] || "요건"} 이수과목`];
  while (remaining > 0) {
    const credits = remaining >= 3 ? 3 : remaining >= 2 ? 2 : remaining;
    const number = index + 1;
    courses.push({
      id: `GLS-${profile.studentNumber}-${requirementId}-${number}`,
      code: `GLS-${requirementId.toUpperCase().slice(0, 4)}-${String(number).padStart(2, "0")}`,
      name: names[index % names.length],
      area: requirementAreaLabels[requirementId] || "인정 교과목",
      credits,
      completed: true,
      term: getSampleCourseTerm(profile, index),
      grade: ["A+", "A0", "B+", "B0"][index % 4],
      source: "GLS 수강/취득 과목 리스트",
      requirementIds: ["totalCredits", requirementId],
    });
    remaining = Math.round((remaining - credits) * 10) / 10;
    index += 1;
  }
  return courses;
}

function supplementCourseEvidence(profile) {
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
    if (missing > 0) profile.courses.push(...makeSupplementalCourses(profile, id, missing));
  });

  const totalTarget = Number(profile.totalCredits?.completed || 0);
  const totalCurrent = getRequirementEvidenceCredits(profile, "totalCredits");
  const totalMissing = Math.max(0, totalTarget - totalCurrent);
  if (totalMissing > 0) {
    profile.courses.push(...makeSupplementalCourses(profile, "totalCredits", totalMissing).map((course) => ({
      ...course,
      name: `일반선택 이수과목 ${course.name.split("-").pop() || ""}`.trim(),
      area: "일반선택",
      requirementIds: ["totalCredits"],
    })));
  }
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
    profile.courses = JSON.parse(JSON.stringify(PERSONAS.chemSemi.courses));
  }
  if (profile.id === "TEST_P02_LIB_ECON" && (!Array.isArray(profile.courses) || !profile.courses.some((course) => course.code === "ECO2004"))) {
    profile.courses = JSON.parse(JSON.stringify(PERSONAS.libEcon.courses));
  }
  if (profile.id === "TEST_P04_SW_EARLY" && (!Array.isArray(profile.courses) || profile.courses.length < 20)) {
    profile.courses = JSON.parse(JSON.stringify(PERSONAS.softwareEarly.courses));
  }
  const grades = ["A+", "A0", "B+", "A+", "B0", "A0", "B+", "A0"];
  profile.courses = (profile.courses || []).map((course, index) => ({
    ...course,
    id: course.id || `GLS-${profile.studentNumber}-${course.code || index}`,
    term: isTermInDisplayRange(profile, course.term) ? course.term : getSampleCourseTerm(profile, index),
    grade: course.grade || (course.completed ? grades[index % grades.length] : "예정"),
    source: course.source || "GLS 샘플",
    requirementIds: course.requirementIds || inferCourseRequirements(course),
  }));
  supplementCourseEvidence(profile);
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
      description: profile.earlyGraduation ? "조기졸업은 6~7학기 등록 기준" : "일반졸업은 8학기 이상 등록",
      completed: profile.currentSemester,
      required: profile.earlyGraduation ? 6 : 8,
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
          ? "https://semi.skku.edu/ase/dept_curriculum.do"
          : profile.id === "TEST_P03_GLB_BIZ"
            ? "https://skb.skku.edu/gba/curriculum.do?lang=All&pager.offset=60"
            : "https://ibook.skku.edu/Viewer/OCFDOM5VH4A2",
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
  return { courses, poomActions, roadmap, totalGap, sourceUrl: "https://ibook.skku.edu/Viewer/OCFDOM5VH4A2" };
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

export function getLocalAnswer(question, profile) {
  const normalized = question.replace(/\s/g, "").toLowerCase();
  const actions = getActionItems(profile);
  const studyPlan = getPersonalizedStudyPlan(profile);

  if (normalized.includes("수업") || normalized.includes("과목") || normalized.includes("로드맵") || normalized.includes("수강")) {
    const courses = studyPlan.courses.length
      ? studyPlan.courses.map((course, index) => `${index + 1}. ${course.code} ${course.name} (${course.credits}학점) - ${course.reason}`).join("\n")
      : "현재 저장된 프로필에서는 우선 추천할 미이수 과목이 없습니다.";
    return `${profile.department} ${profile.admissionYear}학번의 부족 영역과 전공 로드맵을 연결한 수강 후보입니다.\n\n${courses}\n\n실제 전공 인정, 개설 학기, 선수과목은 수강신청 전 GLS 수강편람과 학과 교육과정에서 최종 확인해 주세요.`;
  }

  if (normalized.includes("부족") || normalized.includes("뭐해야") || normalized.includes("무엇을")) {
    const summary = actions.length
      ? actions.map((item, index) => `${index + 1}. ${item.title} - ${item.detail}`).join("\n")
      : "현재 입력된 항목은 모두 충족으로 표시됩니다.";
    return `${profile.name}님의 현재 입력값 기준 우선 확인할 항목입니다.\n\n${summary}\n\n최종 졸업 판정은 학과사무실과 GLS에서 다시 확인해 주세요.`;
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

  if (normalized.includes("ds") || normalized.includes("디에스") || normalized.includes("공학컴퓨터") || normalized.includes("프로그래밍기초")) {
    if (profile.dsEducation.exception) {
      return `${profile.department} ${profile.admissionYear}학번에는 학과 지정 DS 과목 예외가 적용됩니다.\n\n- DASF003 공학컴퓨터프로그래밍: 3학점\n- DASF004 프로그래밍기초와실습: 3학점\n- 현재 인정 상태: ${profile.dsEducation.completed}/${profile.dsEducation.required}학점\n\n일반 DS 기본과목명이 아니라 위 지정과목 이수 여부로 판정합니다. 최종 인정은 GLS와 학과 교육과정표에서 확인해 주세요.`;
    }
    return `현재 DS 교육과정은 ${profile.dsEducation.completed}/${profile.dsEducation.required}학점으로 입력되어 있습니다. 입학연도와 학과에 따라 지정 과목이 달라질 수 있으므로 최신 교육과정표를 함께 확인해 주세요.`;
  }

  if (normalized.includes("전공") || normalized.includes("학점")) {
    const secondary = profile.secondaryMajor
      ? `\n- ${profile.degreeType === "linked_major" ? "연계전공" : profile.degreeType === "convergence_track" ? "융합트랙" : "제2전공"}: ${profile.secondaryMajor.completed}/${profile.secondaryMajor.required}학점`
      : "";
    const candidates = studyPlan.courses.slice(0, 3).map((course) => `${course.code} ${course.name}`).join(", ");
    return `전공 이수 현황입니다.\n\n- 제1전공: ${profile.primaryMajor.completed}/${profile.primaryMajor.required}학점${secondary}\n- 총 졸업학점: ${profile.totalCredits.completed}/${profile.totalCredits.required}학점\n- 우선 수강 후보: ${candidates || "현재 추천 후보 없음"}\n\n복수전공·연계전공 학생은 각 전공의 졸업평가도 함께 확인해야 합니다.`;
  }

  if (normalized.includes("졸업평가") || normalized.includes("논문") || normalized.includes("시험")) {
    const checklist = profile.graduationEvaluation.checklist
      .map((item) => `- ${item.completed ? "완료" : "미완료"}: ${item.label}`)
      .join("\n");
    return `${profile.graduationEvaluation.description}\n\n${checklist}\n\n세부 일정과 제출 형식은 해당 학기 학과 공지를 확인해 주세요.`;
  }

  return `${profile.department} ${profile.admissionYear}학번 프로필을 기준으로 답변하고 있어요. “지금 부족한 요건”, “조기졸업 가능성”, “3품 현황”, “전공학점”, “졸업평가”처럼 질문하면 현재 입력값과 조사된 규칙을 연결해 안내할 수 있습니다.`;
}
