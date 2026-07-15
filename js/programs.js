import { escapeHtml, initAppShell } from "./common.js";

const profile = initAppShell({ page: "programs", title: "맞춤 비교과 추천" });
if (!profile) throw new Error("Profile required");

const PROGRAMS = [
  {
    title: "KT AICE Associate 자격증 취득 과정",
    category: "ai",
    categoryLabel: "AI 인증",
    hours: 10,
    format: "도전학기 비교과",
    note: "공식 공지의 신청 상태와 자격증 인정 조건 확인",
    url: "https://www.skku.edu/skku/campus/skk_comm/notice07.do?articleNo=137828&mode=view",
  },
  {
    title: "노베이스도 3시간 만에 합격하는 ADsP",
    category: "ai",
    categoryLabel: "AI 인증",
    hours: 5,
    format: "온라인",
    note: "2026 도전학기 프로그램 · 최신 접수 상태 확인",
    url: "https://eng.skku.edu/skku/campus/skk_comm/notice07.do?articleNo=138192&mode=view",
  },
  {
    title: "파이썬 활용 머신러닝과 딥러닝 기초다지기",
    category: "ai",
    categoryLabel: "AI 인증",
    hours: 10,
    format: "도전학기 비교과",
    note: "2026 공식 공지 기준 · 프로그램별 일정 변경 가능",
    url: "https://www.skku.edu/skku/campus/skk_comm/notice07.do?articleNo=137827&mode=view",
  },
  {
    title: "성균공부방: Share via AI",
    category: "creativity",
    categoryLabel: "창의 인증",
    hours: 6,
    format: "온·오프라인",
    note: "2026 도전학기 안내 기준",
    url: "https://www.skku.edu/skku/campus/skk_comm/notice01.do?mode=view&articleNo=137324&article.offset=0&articleLimit=10&srSearchVal=%EC%84%B1%EA%B7%A0%EA%B3%B5%EB%B6%80%EB%B0%A9",
  },
  {
    title: "BRIDGE Builder 글로벌 프로젝트",
    category: "global",
    categoryLabel: "글로벌 역량",
    hours: null,
    format: "팀 프로젝트",
    note: "3품 인정 여부와 2026 선발 일정을 공지에서 확인",
    url: "https://www.skku.edu/skku/campus/skk_comm/notice07.do?mode=view&articleNo=138050",
  },
  {
    title: "SKKU Global Colloquium",
    category: "global",
    categoryLabel: "글로벌 역량",
    hours: null,
    format: "오프라인",
    note: "행사 참여가 3품으로 인정되는지 챌린지스퀘어에서 확인",
    url: "https://www.skku.edu/skku/campus/skk_comm/notice07.do?mode=view&articleNo=138380&article.offset=0&articleLimit=10&srSearchVal=SKKU+Global+Colloquium",
  },
];

const pendingCategories = new Set(profile.poom.filter((item) => !item.completed).map((item) => item.id));
const completedCount = profile.poom.filter((item) => item.completed).length;

const rankedPrograms = PROGRAMS.map((program) => ({
  ...program,
  matchScore: (pendingCategories.has(program.category) ? 70 : 25) + (program.hours ? 15 : 0) + (program.format.includes("온라인") ? 10 : 0),
  matched: pendingCategories.has(program.category),
})).sort((a, b) => b.matchScore - a.matchScore);

document.querySelector("#pageContent").innerHTML = `
  <div class="page-content">
    <div class="page-header">
      <div>
        <p class="eyebrow">Opportunity matching</p>
        <h1>부족한 인증에 맞춘 비교과</h1>
        <p>현재 3품 입력값과 2026년 공식 공지 사례를 연결했습니다. 실제 신청 가능 여부와 인정시간은 챌린지스퀘어에서 최종 확인하세요.</p>
      </div>
      <a class="btn btn-secondary" href="requirements.html#poom">3품 현황 수정</a>
    </div>

    <div class="profile-strip">
      <div><strong>${escapeHtml(profile.name)}님의 3품 현황</strong><span>${completedCount}/3개 충족 · 미완료 ${profile.poom.filter((item) => !item.completed).map((item) => item.label).join(" · ") || "없음"}</span></div>
      <span class="badge ${completedCount >= 3 ? "badge-success" : "badge-warning"}">${completedCount >= 3 ? "졸업 기준 충족" : `${3 - completedCount}개 더 필요`}</span>
    </div>

    <div class="program-toolbar" role="group" aria-label="프로그램 필터">
      <button class="filter-chip active" type="button" data-filter="all">전체</button>
      <button class="filter-chip" type="button" data-filter="matched">나에게 필요한 인증</button>
      <button class="filter-chip" type="button" data-filter="ai">AI</button>
      <button class="filter-chip" type="button" data-filter="creativity">창의</button>
      <button class="filter-chip" type="button" data-filter="global">글로벌</button>
    </div>

    <section class="program-grid" id="programGrid">
      ${rankedPrograms.map(renderProgram).join("")}
    </section>

    <section class="more-programs-panel" aria-labelledby="moreProgramsTitle">
      <div>
        <p class="eyebrow">More opportunities</p>
        <h2 id="moreProgramsTitle">더 많은 비교과 알아보기</h2>
        <p>3품, 비교과, 현장실습 기회는 학기마다 달라집니다. 공식 안내 페이지에서 최신 모집 여부를 함께 확인하세요.</p>
      </div>
      <div class="more-program-links">
        <a href="https://skkustusuccess.notion.site/" target="_blank" rel="noreferrer">
          <strong>SKKU 비교과 가이드</strong>
          <span>비교과 프로그램과 학생성공 활동 안내</span>
        </a>
        <a href="https://tollgate.skku.edu/" target="_blank" rel="noreferrer">
          <strong>성균관대학교 현장실습지원센터(Co-op)</strong>
          <span>인턴십·현장실습 신청과 공지 확인</span>
        </a>
        <a href="https://job.skku.edu/Main/" target="_blank" rel="noreferrer">
          <strong>학생인재개발팀 대학일자리플러스센터</strong>
          <span>진로·취업 상담, 채용정보, 취업 프로그램 확인</span>
        </a>
      </div>
    </section>

    <div class="alert alert-warning" style="margin-top:18px">추천 점수는 미완료 인증 일치 여부, 공지된 인정시간, 참여 방식만 반영한 MVP 규칙입니다. 프로그램 이수만으로 인증이 자동 확정되는 것은 아닙니다.</div>
  </div>`;

function renderProgram(program) {
  return `
    <article class="program-card" data-category="${program.category}" data-matched="${program.matched}">
      <div class="program-card-head">
        <span class="badge ${program.matched ? "badge-success" : ""}">${program.matched ? "맞춤 추천" : escapeHtml(program.categoryLabel)}</span>
        <strong class="match-score">${program.matchScore}점</strong>
      </div>
      <h2>${escapeHtml(program.title)}</h2>
      <div class="program-meta">
        <span>${escapeHtml(program.format)}</span>
        <span>${program.hours ? `3품 인정 ${program.hours}시간` : "인정 여부 확인 필요"}</span>
      </div>
      <p>${escapeHtml(program.note)}</p>
      <a class="btn btn-secondary btn-block" href="${program.url}" target="_blank" rel="noreferrer">공식 공지 확인</a>
    </article>`;
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".program-card").forEach((card) => {
      const visible =
        filter === "all" ||
        card.dataset.category === filter ||
        (filter === "matched" && card.dataset.matched === "true");
      card.classList.toggle("hidden", !visible);
    });
  });
});
