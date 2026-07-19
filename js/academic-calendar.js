import { saveProfile } from "./auth.js";
import { escapeHtml, initAppShell, showToast } from "./common.js";
import {
  CATEGORY_CLASSES,
  CATEGORY_LABELS,
  SCHOOL_CALENDAR_EVENTS,
  formatKoreanDate,
  getAllCalendarEvents,
  getReminderEvents,
  parseDateOnly,
  toDateKey,
} from "./academic-schedule-data.js";

const OFFICIAL_SCHEDULE_URL = "https://www.skku.edu/skku/edu/bachelor/ca_de_schedule.do";
const profile = initAppShell({ page: "calendar", title: "학사 일정 캘린더" });
if (!profile) throw new Error("Profile required");

let viewDate = new Date();
let editingEventId = null;

function getPersonalEvents() {
  return Array.isArray(profile.academicCalendarEvents) ? profile.academicCalendarEvents : [];
}

function setPersonalEvents(events) {
  profile.academicCalendarEvents = events;
}

function getMonthLabel(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

function getMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    return current;
  });
}

function isEventInRange(event, startDate, endDate) {
  return parseDateOnly(event.start) <= endDate && parseDateOnly(event.end || event.start) >= startDate;
}

function getEventsForWeek(weekDays) {
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  return getAllCalendarEvents(profile)
    .filter((event) => isEventInRange(event, weekStart, weekEnd))
    .sort((a, b) => {
      const startOrder = a.start.localeCompare(b.start);
      if (startOrder) return startOrder;
      const aDuration = parseDateOnly(a.end || a.start) - parseDateOnly(a.start);
      const bDuration = parseDateOnly(b.end || b.start) - parseDateOnly(b.start);
      return bDuration - aDuration || a.title.localeCompare(b.title, "ko");
    });
}

function getDayOffset(date, weekStart) {
  return Math.round((date - weekStart) / 86400000);
}

function layoutWeekEvents(weekDays) {
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const laneEnds = [];

  return getEventsForWeek(weekDays).map((event) => {
    const eventStart = parseDateOnly(event.start);
    const eventEnd = parseDateOnly(event.end || event.start);
    const startColumn = Math.max(0, getDayOffset(eventStart, weekStart));
    const endColumn = Math.min(6, getDayOffset(eventEnd, weekStart));
    let lane = laneEnds.findIndex((lastColumn) => lastColumn < startColumn);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = endColumn;
    return {
      event,
      lane,
      startColumn,
      span: endColumn - startColumn + 1,
      continuesBefore: eventStart < weekStart,
      continuesAfter: eventEnd > weekEnd,
    };
  });
}

function getHolidayNames(date) {
  const dayKey = toDateKey(date);
  return getAllCalendarEvents(profile)
    .filter((event) => event.category === "holiday" && event.start <= dayKey && (event.end || event.start) >= dayKey)
    .map((event) => event.title);
}

function getPersonalEventById(id) {
  return getPersonalEvents().find((event) => event.id === id);
}

function renderWeekEvent(segment) {
  const { event, lane, startColumn, span, continuesBefore, continuesAfter } = segment;
  const category = event.category || "personal";
  const editable = event.personal ? `data-edit-event="${escapeHtml(event.id)}"` : "";
  const continuationClasses = `${continuesBefore ? "continues-before" : ""} ${continuesAfter ? "continues-after" : ""}`;
  const label = `${CATEGORY_LABELS[category] || "일정"}: ${event.title}, ${formatEventRange(event)}`;
  return `
    <button
      class="calendar-event-bar ${CATEGORY_CLASSES[category] || "personal"} ${continuationClasses}"
      type="button"
      style="grid-column: ${startColumn + 1} / span ${span}; grid-row: ${lane + 2};"
      aria-label="${escapeHtml(label)}"
      title="${escapeHtml(event.title)}"
      ${editable}
      ${event.personal ? "" : "disabled"}
    >
      <span>${escapeHtml(event.title)}</span>
    </button>`;
}

function renderCalendarGrid() {
  const todayKey = toDateKey(new Date());
  const month = viewDate.getMonth();
  const weeks = Array.from({ length: 6 }, (_, index) => getMonthDays(viewDate).slice(index * 7, index * 7 + 7));

  return `
    <div class="academic-calendar-scroll">
      <div class="academic-calendar-weekdays" aria-hidden="true">
        ${["일", "월", "화", "수", "목", "금", "토"].map((day) => `<span>${day}</span>`).join("")}
      </div>
      <div class="academic-calendar-grid">
        ${weeks
          .map((weekDays) => {
            const eventSegments = layoutWeekEvents(weekDays);
            const laneCount = Math.max(2, ...eventSegments.map((segment) => segment.lane + 1));
            return `
              <div class="academic-calendar-week" style="--calendar-lanes: ${laneCount};">
                ${weekDays
                  .map((date, dayIndex) => {
                    const dayKey = toDateKey(date);
                    const holidayNames = getHolidayNames(date);
                    const isSunday = dayIndex === 0;
                    const isSaturday = dayIndex === 6;
                    return `
                      <article
                        class="academic-calendar-day ${date.getMonth() !== month ? "muted-month" : ""} ${dayKey === todayKey ? "today" : ""} ${holidayNames.length ? "holiday-day" : ""} ${isSunday ? "sunday" : ""} ${isSaturday ? "saturday" : ""}"
                        style="grid-column: ${dayIndex + 1};"
                      >
                        <div class="calendar-day-head">
                          <strong>${date.getDate()}</strong>
                          ${dayKey === todayKey ? `<span class="today-label">오늘</span>` : ""}
                        </div>
                        ${holidayNames.length ? `<span class="calendar-holiday-name">${escapeHtml(holidayNames[0])}</span>` : ""}
                      </article>`;
                  })
                  .join("")}
                ${eventSegments.map(renderWeekEvent).join("")}
              </div>`;
          })
          .join("")}
      </div>
    </div>`;
}

function renderReminderList() {
  const reminders = getReminderEvents(profile);
  return reminders.length
    ? reminders
        .map(
          (event) => `
            <article class="deadline-card ${CATEGORY_CLASSES[event.category] || "personal"}">
              <span>D-${event.daysUntilDeadline}</span>
              <div>
                <strong>${escapeHtml(event.title)}</strong>
                <p>마감일 ${formatKoreanDate(event.end || event.start)} · 신청 기간 ${formatEventRange(event)}</p>
              </div>
            </article>`,
        )
        .join("")
    : `<div class="deadline-empty"><strong>현재 마감 7일 이내인 신청 일정이 없습니다.</strong><p>새로운 신청 일정은 학교 공지사항과 공식 학사일정에서 최종 확인해 주세요.</p></div>`;
}

function formatEventRange(event) {
  const start = formatKoreanDate(event.start);
  const end = event.end && event.end !== event.start ? ` ~ ${formatKoreanDate(event.end)}` : "";
  return `${start}${end}`;
}

function renderOfficialList() {
  return SCHOOL_CALENDAR_EVENTS.slice()
    .sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title, "ko"))
    .map(
    (event) => `
      <article class="official-schedule-row ${CATEGORY_CLASSES[event.category] || ""}">
        <span>${escapeHtml(CATEGORY_LABELS[event.category] || "학사 일정")}</span>
        <div>
          <strong>${escapeHtml(event.title)}</strong>
          <p>${formatEventRange(event)} · ${escapeHtml(event.note || event.source)}</p>
        </div>
      </article>`,
    )
    .join("");
}

function resetForm() {
  editingEventId = null;
  const form = document.querySelector("#academicEventForm");
  form.reset();
  const today = toDateKey(new Date());
  document.querySelector("#eventStart").value = today;
  document.querySelector("#eventEnd").value = today;
  document.querySelector("#eventCategory").value = "personal";
  document.querySelector("#eventFormMode").textContent = "새 일정";
  document.querySelector("#deleteEventButton").classList.add("hidden");
}

function fillForm(eventId) {
  const event = getPersonalEventById(eventId);
  if (!event) return;
  editingEventId = event.id;
  document.querySelector("#eventTitle").value = event.title || "";
  document.querySelector("#eventStart").value = event.start || "";
  document.querySelector("#eventEnd").value = event.end || event.start || "";
  document.querySelector("#eventCategory").value = event.category || "personal";
  document.querySelector("#eventMemo").value = event.note || "";
  document.querySelector("#eventFormMode").textContent = "일정 수정";
  document.querySelector("#deleteEventButton").classList.remove("hidden");
  document.querySelector("#academicEventForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function persistPersonalEvents(events, message) {
  setPersonalEvents(events);
  const saved = await saveProfile(profile);
  if (!saved) {
    showToast("저장하지 못했습니다. 네트워크 상태를 확인해 주세요.");
    return false;
  }
  renderPage();
  showToast(message);
  return true;
}

function bindActions() {
  document.querySelector("#prevMonth").addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderPage();
  });
  document.querySelector("#nextMonth").addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderPage();
  });
  document.querySelector("#todayMonth").addEventListener("click", () => {
    viewDate = new Date();
    renderPage();
  });
  document.querySelector("#resetEventButton").addEventListener("click", resetForm);
  document.querySelector("#deleteEventButton").addEventListener("click", async () => {
    const event = getPersonalEventById(editingEventId);
    if (!event || !window.confirm(`"${event.title}" 일정을 삭제할까요?`)) return;
    await persistPersonalEvents(getPersonalEvents().filter((item) => item.id !== editingEventId), "일정을 삭제했습니다.");
  });
  document.querySelectorAll("[data-edit-event]").forEach((button) => {
    button.addEventListener("click", () => fillForm(button.dataset.editEvent));
  });
  document.querySelector("#academicEventForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const start = String(data.get("start"));
    const end = String(data.get("end") || start);
    const title = String(data.get("title") || "").trim();
    if (!title) {
      showToast("일정 제목을 입력해 주세요.");
      return;
    }
    if (parseDateOnly(end) < parseDateOnly(start)) {
      showToast("종료일은 시작일보다 빠를 수 없습니다.");
      return;
    }
    const draft = {
      id: editingEventId || `academic_${Date.now()}`,
      title,
      start,
      end,
      category: String(data.get("category") || "personal"),
      note: String(data.get("memo") || "").trim(),
      updatedAt: new Date().toISOString(),
    };
    const nextEvents = editingEventId
      ? getPersonalEvents().map((item) => (item.id === editingEventId ? draft : item))
      : [draft, ...getPersonalEvents()];
    await persistPersonalEvents(nextEvents, editingEventId ? "일정을 수정했습니다." : "새 일정을 저장했습니다.");
  });
}

function renderPage() {
  const personalCount = getPersonalEvents().length;
  document.querySelector("#pageContent").innerHTML = `
    <div class="page-content academic-calendar-page">
      <section class="page-header academic-calendar-hero">
        <div>
          <p class="eyebrow">SKKU ACADEMIC CALENDAR</p>
          <h1>학사 일정 캘린더</h1>
          <p>성균관대학교 주요 신청 기간과 학사 일정을 월별로 확인하고, 개인 일정을 함께 관리할 수 있습니다.</p>
        </div>
        <span class="badge badge-info">내 일정 ${personalCount}개</span>
      </section>

      <section class="deadline-panel">
        <div class="deadline-panel-heading">
          <div>
            <p class="eyebrow">APPLICATION DEADLINE</p>
            <h2>신청 마감 알림</h2>
            <p>수강신청, 복수전공 및 융합트랙 등 주요 신청 일정의 마감일을 7일 전부터 안내합니다.</p>
          </div>
          <a class="official-calendar-link" href="${OFFICIAL_SCHEDULE_URL}" target="_blank" rel="noreferrer">성균관대학교 공식 학사일정 <span aria-hidden="true">↗</span></a>
        </div>
        <div class="deadline-grid">${renderReminderList()}</div>
      </section>

      <section class="calendar-layout">
        <div class="calendar-main-panel">
          <div class="calendar-toolbar">
            <div>
              <p class="eyebrow">MONTHLY CALENDAR</p>
              <h2>${getMonthLabel(viewDate)}</h2>
            </div>
            <div class="calendar-controls" aria-label="월 이동">
              <button class="calendar-arrow-button" id="prevMonth" type="button" aria-label="이전 달" title="이전 달">←</button>
              <button class="calendar-today-button" id="todayMonth" type="button">오늘</button>
              <button class="calendar-arrow-button" id="nextMonth" type="button" aria-label="다음 달" title="다음 달">→</button>
            </div>
          </div>
          ${renderCalendarGrid()}
        </div>

        <aside class="calendar-side-panel">
          <form id="academicEventForm" class="academic-event-form">
            <div class="panel-header">
              <div>
                <p class="eyebrow">MY SCHEDULE</p>
                <h2>개인 일정 등록</h2>
                <p>공지사항, 상담, 서류 제출 등 기억해야 할 일정을 계정별로 저장할 수 있습니다.</p>
              </div>
              <span class="badge badge-info" id="eventFormMode">새 일정</span>
            </div>
            <div class="field">
              <label for="eventTitle">일정명</label>
              <input id="eventTitle" name="title" placeholder="예: 복수전공 제출 서류 확인" required />
            </div>
            <div class="form-grid compact-form-grid">
              <div class="field">
                <label for="eventStart">시작일</label>
                <input id="eventStart" name="start" type="date" required />
              </div>
              <div class="field">
                <label for="eventEnd">종료일</label>
                <input id="eventEnd" name="end" type="date" required />
              </div>
            </div>
            <div class="field">
              <label for="eventCategory">구분</label>
              <select id="eventCategory" name="category">
                <option value="personal">내 일정</option>
                <option value="course">수강신청</option>
                <option value="track">융합트랙</option>
                <option value="major">전공 신청</option>
                <option value="academic">학사 일정</option>
              </select>
            </div>
            <div class="field">
              <label for="eventMemo">메모</label>
              <textarea id="eventMemo" name="memo" placeholder="준비 서류, 관련 링크, 담당 부서 등을 기록하세요."></textarea>
            </div>
            <div class="form-actions">
              <button class="btn btn-danger hidden" id="deleteEventButton" type="button">삭제</button>
              <button class="btn btn-secondary" id="resetEventButton" type="button">새로 작성</button>
              <button class="btn" type="submit">저장</button>
            </div>
          </form>
        </aside>
      </section>

      <section class="official-schedule-panel">
        <div class="panel-header official-panel-heading">
          <div>
            <p class="eyebrow">OFFICIAL SCHEDULE</p>
            <h2>2026학년도 주요 학사 일정</h2>
            <p>학교 공식 학사일정과 제공된 수강신청 일정표를 기준으로 정리했습니다. 일정 변경 여부는 공식 페이지에서 최종 확인해 주세요.</p>
          </div>
          <a class="official-calendar-link" href="${OFFICIAL_SCHEDULE_URL}" target="_blank" rel="noreferrer">공식 학사일정 확인 <span aria-hidden="true">↗</span></a>
        </div>
        <div class="official-schedule-list">${renderOfficialList()}</div>
      </section>
    </div>`;
  bindActions();
  resetForm();
}

renderPage();
