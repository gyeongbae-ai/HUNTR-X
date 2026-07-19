import { saveProfile } from "./auth.js";
import { escapeHtml, initAppShell, showToast } from "./common.js";
import {
  CATEGORY_CLASSES,
  CATEGORY_LABELS,
  SCHOOL_CALENDAR_EVENTS,
  formatKoreanDate,
  getAllAcademicEvents,
  getReminderEvents,
  parseDateOnly,
  toDateKey,
} from "./academic-schedule-data.js";

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

function isEventOnDate(event, date) {
  const day = toDateKey(date);
  return event.start <= day && (event.end || event.start) >= day;
}

function getEventsForDate(date) {
  return getAllAcademicEvents(profile)
    .filter((event) => isEventOnDate(event, date))
    .sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title, "ko"));
}

function getPersonalEventById(id) {
  return getPersonalEvents().find((event) => event.id === id);
}

function renderEventPill(event) {
  const category = event.category || "personal";
  const editable = event.personal ? `data-edit-event="${escapeHtml(event.id)}"` : "";
  return `
    <button class="calendar-event-pill ${CATEGORY_CLASSES[category] || "personal"}" type="button" ${editable} ${event.personal ? "" : "disabled"}>
      <span>${escapeHtml(CATEGORY_LABELS[category] || "일정")}</span>
      ${escapeHtml(event.title)}
    </button>`;
}

function renderCalendarGrid() {
  const todayKey = toDateKey(new Date());
  const month = viewDate.getMonth();
  return `
    <div class="academic-calendar-scroll">
      <div class="academic-calendar-weekdays" aria-hidden="true">
        ${["일", "월", "화", "수", "목", "금", "토"].map((day) => `<span>${day}</span>`).join("")}
      </div>
      <div class="academic-calendar-grid">
        ${getMonthDays(viewDate)
          .map((date) => {
            const dayKey = toDateKey(date);
            const events = getEventsForDate(date);
            return `
              <article class="academic-calendar-day ${date.getMonth() !== month ? "muted-month" : ""} ${dayKey === todayKey ? "today" : ""}">
                <div class="calendar-day-head">
                  <strong>${date.getDate()}</strong>
                  ${dayKey === todayKey ? `<span>오늘</span>` : ""}
                </div>
                <div class="calendar-day-events">
                  ${events.slice(0, 4).map(renderEventPill).join("")}
                  ${events.length > 4 ? `<span class="calendar-more">+${events.length - 4}개</span>` : ""}
                </div>
              </article>`;
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
                <p>${formatEventRange(event)} 마감 기준 일주일 전 알림</p>
              </div>
            </article>`,
        )
        .join("")
    : `<div class="empty-plan-state"><strong>일주일 안에 마감되는 일정이 없습니다.</strong><p>수강신청, 융합트랙, 복수전공 기간은 매년 초 공지사항에서 다시 확인하세요.</p></div>`;
}

function formatEventRange(event) {
  const start = formatKoreanDate(event.start);
  const end = event.end && event.end !== event.start ? `~${formatKoreanDate(event.end)}` : "";
  return `${start}${end}`;
}

function renderOfficialList() {
  return SCHOOL_CALENDAR_EVENTS.map(
    (event) => `
      <article class="official-schedule-row ${CATEGORY_CLASSES[event.category] || ""}">
        <span>${escapeHtml(CATEGORY_LABELS[event.category] || "학사")}</span>
        <div>
          <strong>${escapeHtml(event.title)}</strong>
          <p>${formatEventRange(event)} · ${escapeHtml(event.note || event.source)}</p>
        </div>
      </article>`,
  ).join("");
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
    showToast("저장에 실패했습니다. 네트워크 상태를 확인해 주세요.");
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
    await persistPersonalEvents(nextEvents, editingEventId ? "일정을 수정했습니다." : "내 일정을 저장했습니다.");
  });
}

function renderPage() {
  const personalCount = getPersonalEvents().length;
  document.querySelector("#pageContent").innerHTML = `
    <div class="page-content academic-calendar-page">
      <section class="page-header academic-calendar-hero">
        <div>
          <p class="eyebrow">Academic notice calendar</p>
          <h1>학사 일정과 내 알림 캘린더</h1>
          <p>수강신청, 융합트랙, 복수전공 신청 기간을 한 달 캘린더에서 확인하고, 잊으면 안 되는 학교 관련 일정을 로그인별로 저장할 수 있습니다.</p>
        </div>
        <span class="badge badge-info">내 일정 ${personalCount}개</span>
      </section>

      <section class="deadline-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Deadline reminders</p>
            <h2>마감 7일 전부터 뜨는 알림</h2>
            <p>마감일 기준 D-7부터 상단 고정 배너와 이 영역에 표시됩니다.</p>
          </div>
        </div>
        <div class="deadline-grid">${renderReminderList()}</div>
      </section>

      <section class="calendar-layout">
        <div class="calendar-main-panel">
          <div class="calendar-toolbar">
            <div>
              <p class="eyebrow">Monthly calendar</p>
              <h2>${getMonthLabel(viewDate)}</h2>
            </div>
            <div class="calendar-controls">
              <button class="btn btn-secondary btn-ghost" id="prevMonth" type="button">이전</button>
              <button class="btn btn-secondary btn-ghost" id="todayMonth" type="button">오늘</button>
              <button class="btn btn-secondary btn-ghost" id="nextMonth" type="button">다음</button>
            </div>
          </div>
          ${renderCalendarGrid()}
        </div>

        <aside class="calendar-side-panel">
          <form id="academicEventForm" class="academic-event-form">
            <div class="panel-header">
              <div>
                <p class="eyebrow">My school event</p>
                <h2>내 일정 추가</h2>
                <p>공지사항, 장학금, 면담, 제출 마감 등을 직접 저장하세요.</p>
              </div>
              <span class="badge badge-info" id="eventFormMode">새 일정</span>
            </div>
            <div class="field">
              <label for="eventTitle">일정 제목</label>
              <input id="eventTitle" name="title" placeholder="예: 복수전공 신청 서류 확인" required />
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
              <label for="eventCategory">분류</label>
              <select id="eventCategory" name="category">
                <option value="personal">내 일정</option>
                <option value="course">수강신청</option>
                <option value="track">융합트랙</option>
                <option value="major">전공신청</option>
              </select>
            </div>
            <div class="field">
              <label for="eventMemo">메모</label>
              <textarea id="eventMemo" name="memo" placeholder="챙길 서류, 링크, 담당 부서 등을 적어두세요."></textarea>
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
        <div class="panel-header">
          <div>
            <p class="eyebrow">Official periods</p>
            <h2>수강신청·융합트랙·복수전공 주요 기간</h2>
            <p>첨부된 2026학년도 수강신청 일정과 학사일정표 기준입니다. 세부 조건은 매년 초 공지사항에서 최종 확인하세요.</p>
          </div>
        </div>
        <div class="official-schedule-list">${renderOfficialList()}</div>
      </section>
    </div>`;
  bindActions();
  resetForm();
}

renderPage();
