export const SCHOOL_CALENDAR_EVENTS = [
  {
    id: "course-cart-2026-1",
    title: "1학기 수강신청 장바구니",
    category: "course",
    start: "2026-02-03",
    end: "2026-02-04",
    source: "2026학년도 수강신청 일정",
    note: "10:00 시작, 마감일 22:59 종료",
  },
  {
    id: "course-registration-2026-1",
    title: "1학기 수강신청",
    category: "course",
    start: "2026-02-13",
    end: "2026-02-20",
    source: "2026학년도 수강신청 일정",
    note: "학년별 시작 시간이 다릅니다.",
  },
  {
    id: "course-change-2026-1",
    title: "1학기 수강신청 확인/변경",
    category: "course",
    start: "2026-03-03",
    end: "2026-03-07",
    source: "2026학년도 수강신청 일정",
    note: "폐반 확정 과목 확인 기간도 함께 확인하세요.",
  },
  {
    id: "closed-course-add-2026-1",
    title: "1학기 폐반과목 추가 수강신청",
    category: "course",
    start: "2026-03-10",
    end: "2026-03-10",
    source: "2026학년도 수강신청 일정",
    note: "10:00~22:59",
  },
  {
    id: "double-major-2026-1",
    title: "복수전공/전공변경 1학기 신청",
    category: "major",
    start: "2026-03-03",
    end: "2026-03-06",
    source: "2026학년도 학사일정표",
    note: "매년 초 공지사항에서 세부 자격과 제출 서류를 확인하세요.",
  },
  {
    id: "convergence-track-2026-1-1",
    title: "융합트랙 1차 신청",
    category: "track",
    start: "2026-04-20",
    end: "2026-04-24",
    source: "2026학년도 학사일정표",
    note: "학생설계전공, 융합트랙 신청 기간",
  },
  {
    id: "undergrad-grad-linked-2026-2",
    title: "학부·대학원 연계과정 2학기 신청",
    category: "major",
    start: "2026-06-29",
    end: "2026-07-10",
    source: "2026학년도 학사일정표",
    note: "학부·대학원 연계과정 신청 기간",
  },
  {
    id: "convergence-track-2026-1-2",
    title: "융합트랙 2차 신청",
    category: "track",
    start: "2026-07-13",
    end: "2026-07-17",
    source: "2026학년도 학사일정표",
    note: "졸업예정자는 별도 제한이 있을 수 있습니다.",
  },
  {
    id: "double-major-2026-2",
    title: "복수전공/전공변경 2학기 신청",
    category: "major",
    start: "2026-07-20",
    end: "2026-07-24",
    source: "2026학년도 학사일정표",
    note: "매년 초 공지사항에서 최종 신청 공지를 확인하세요.",
  },
  {
    id: "course-cart-2026-2",
    title: "2학기 수강신청 장바구니",
    category: "course",
    start: "2026-08-04",
    end: "2026-08-05",
    source: "2026학년도 수강신청 일정",
    note: "10:00 시작, 마감일 22:59 종료",
  },
  {
    id: "course-registration-2026-2",
    title: "2학기 수강신청",
    category: "course",
    start: "2026-08-13",
    end: "2026-08-18",
    source: "2026학년도 수강신청 일정",
    note: "학년별 시작 시간이 다릅니다.",
  },
  {
    id: "course-change-2026-2",
    title: "2학기 수강신청 확인/변경",
    category: "course",
    start: "2026-08-31",
    end: "2026-09-05",
    source: "2026학년도 수강신청 일정",
    note: "폐반 확정 과목 확인 기간도 함께 확인하세요.",
  },
  {
    id: "closed-course-add-2026-2",
    title: "2학기 폐반과목 추가 수강신청",
    category: "course",
    start: "2026-09-08",
    end: "2026-09-08",
    source: "2026학년도 수강신청 일정",
    note: "10:00~22:59",
  },
  {
    id: "convergence-track-2026-2-1",
    title: "융합트랙 1차 신청",
    category: "track",
    start: "2026-10-19",
    end: "2026-10-23",
    source: "2026학년도 학사일정표",
    note: "학생설계전공, 융합트랙 신청 기간",
  },
  {
    id: "undergrad-grad-linked-2027-1",
    title: "학부·대학원 연계과정 2027-1학기 신청",
    category: "major",
    start: "2026-11-30",
    end: "2026-12-11",
    source: "2026학년도 학사일정표",
    note: "다음 학년도 1학기 연계과정 신청",
  },
  {
    id: "convergence-track-2026-2-2",
    title: "융합트랙 2차 신청",
    category: "track",
    start: "2027-01-11",
    end: "2027-01-15",
    source: "2026학년도 학사일정표",
    note: "다음 학년도 1학기 진입 전 최종 확인",
  },
];

export const CATEGORY_LABELS = {
  course: "수강신청",
  track: "융합트랙",
  major: "전공신청",
  personal: "내 일정",
};

export const CATEGORY_CLASSES = {
  course: "course",
  track: "track",
  major: "major",
  personal: "personal",
};

export function parseDateOnly(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatKoreanDate(value) {
  const date = typeof value === "string" ? parseDateOnly(value) : value;
  return `${date.getMonth() + 1}.${date.getDate()}.`;
}

export function getEventEndDate(event) {
  return parseDateOnly(event.end || event.start);
}

export function getDaysUntil(targetDate, baseDate = new Date()) {
  const base = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  return Math.ceil((target - base) / 86400000);
}

export function normalizePersonalEvents(profile) {
  return Array.isArray(profile?.academicCalendarEvents)
    ? profile.academicCalendarEvents.map((event) => ({ ...event, category: event.category || "personal", personal: true }))
    : [];
}

export function getAllAcademicEvents(profile) {
  return [...SCHOOL_CALENDAR_EVENTS, ...normalizePersonalEvents(profile)];
}

export function getReminderEvents(profile, baseDate = new Date()) {
  return getAllAcademicEvents(profile)
    .map((event) => ({ ...event, daysUntilDeadline: getDaysUntil(getEventEndDate(event), baseDate) }))
    .filter((event) => event.daysUntilDeadline >= 0 && event.daysUntilDeadline <= 7)
    .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline || a.title.localeCompare(b.title, "ko"));
}

export function getNextAcademicEvent(profile, baseDate = new Date()) {
  return getAllAcademicEvents(profile)
    .map((event) => ({ ...event, daysUntilDeadline: getDaysUntil(parseDateOnly(event.start), baseDate) }))
    .filter((event) => event.daysUntilDeadline >= 0)
    .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline || a.title.localeCompare(b.title, "ko"))[0];
}
