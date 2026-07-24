import { ensureProfile, getProfile, getSession, loginDemo, logout, requireAuth } from "./auth.js";
import { calculateProgress } from "./data.js";
import { initMotionEffects } from "./motion.js";

const navSections = [
  {
    label: "핵심 서비스",
    items: [
      { href: "dashboard.html", label: "진단 대시보드", page: "dashboard" },
      { href: "evidence.html", label: "이수내역·문서 등록", page: "evidence" },
      {
        href: "personal-roadmap.html",
        label: "개인 로드맵",
        page: "roadmap",
        children: [
          { href: "personal-roadmap.html", label: "만약에 시뮬레이션" },
          { href: "next-semester.html", label: "다음 학기 추천 계획" },
          { href: "detailed-roadmap.html", label: "상세 로드맵" },
        ],
      },
    ],
  },
  {
    label: "학사 도구",
    items: [
      { href: "early-graduation.html", label: "조기졸업 진단", page: "early" },
      { href: "assistant.html", label: "AI 학사 도우미", page: "assistant" },
      { href: "programs.html", label: "맞춤 비교과", page: "programs" },
      { href: "academic-calendar.html", label: "학사 일정", page: "calendar" },
    ],
  },
  {
    label: "사용자 메뉴",
    items: [
      { href: "onboarding.html", label: "내 정보 수정", page: "onboarding" },
      { href: "about.html", label: "Contact Us", page: "about" },
    ],
  },
];

export function initAppShell({ page, title, requireProfile = true } = {}) {
  const demoKey = new URLSearchParams(window.location.search).get("demo");
  if (demoKey && !getSession()) loginDemo(demoKey);
  const session = requireAuth();
  if (!session) return null;

  const profile = requireProfile ? ensureProfile() : getProfile();
  if (requireProfile && !profile) return null;

  const app = document.querySelector("#app");
  if (!app) return profile;

  document.body.dataset.page = page || "app";
  initMotionEffects();

  const initials = (profile?.name || session.name || "GQ").slice(0, 1);
  const firstUseGuideKey = `gradquest:first-use-guide:${session.studentNumber || "guest"}`;
  const firstUseGuideSizeKey = `gradquest:first-use-guide-size:${session.studentNumber || "guest"}`;
  const firstUseGuideExpanded = localStorage.getItem(firstUseGuideKey) !== "collapsed";
  const currentPath = window.location.pathname.split("/").pop() || "dashboard.html";
  const nav = navSections.map((section) => `
    <div class="nav-section">
      <span class="nav-section-label">${section.label}</span>
      ${section.items.map((item) => {
        const active = page === item.page;
        return `
          <div class="nav-item-group ${item.children ? "has-children" : ""}">
            <a class="nav-link ${active ? "active" : ""}" href="${item.href}">
              <span>${item.label}</span>${item.children ? `<i aria-hidden="true">⌄</i>` : ""}
            </a>
            ${item.children && active ? `<div class="nav-submenu" aria-label="${item.label} 하위 메뉴">
              ${item.children.map((child) => `<a class="${currentPath === child.href ? "active" : ""}" href="${child.href}" ${currentPath === child.href ? `aria-current="page"` : ""}>${child.label}</a>`).join("")}
            </div>` : ""}
          </div>`;
      }).join("")}
    </div>`).join("");
  app.innerHTML = `
    <div class="app-shell">
      <button class="edge-trigger edge-trigger-top" id="headerTrigger" type="button" aria-controls="siteHeader" aria-expanded="false">
        <span>SKKU</span><span class="edge-trigger-arrow">↓</span>
      </button>
      <button class="edge-trigger edge-trigger-left" id="sidebarTrigger" type="button" aria-controls="sidebar" aria-expanded="false">
        <span class="edge-trigger-arrow">›</span><span>MENU</span>
      </button>
      <header class="site-header" id="siteHeader">
        <div class="utility-bar">
          <div><strong>SKKU</strong><span>성균관대학교 학생 학사정보</span></div>
          <div><span>GradQuest</span><span>학사정보 보조 서비스</span></div>
        </div>
        <div class="global-header">
          <a class="brand" href="dashboard.html" aria-label="GradQuest 홈">
            <img class="skku-logo" src="assets/skku-logo.png" alt="성균관대학교" />
            <span class="brand-divider" aria-hidden="true"></span>
            <span class="gq-brand-lockup">
              <span class="gq-logo-frame gq-logo-mark" aria-hidden="true"><img src="assets/gradquest-logo-vertical.png" alt="" /></span>
              <span class="brand-copy">
                GradQuest
                <small>SKKU GRADUATION GUIDE</small>
              </span>
            </span>
          </a>
          <div class="header-actions">
            <a class="official-link" href="https://www.skku.edu/" target="_blank" rel="noreferrer">학교 홈페이지</a>
            <a class="official-link" href="https://www.skku.edu/skku/campus/skk_comm/notice01.do" target="_blank" rel="noreferrer">학교 공지사항</a>
            <a class="official-link" href="https://chsquare.skku.edu/challenge/nxui/index.html" target="_blank" rel="noreferrer">챌린지스퀘어</a>
            <a class="official-link" href="https://portal.skku.edu/portal/main/main.do#" target="_blank" rel="noreferrer">학교 포털</a>
            <button class="shell-close" id="headerClose" type="button" aria-label="상단 메뉴 닫기">↑</button>
          </div>
        </div>
      </header>
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-heading">
          <div class="sidebar-brand"><span class="gq-logo-frame gq-logo-symbol"><img src="assets/gradquest-logo-vertical.png" alt="" /></span><div><strong>학사정보</strong><span>Graduation Guide</span></div></div>
          <button class="shell-close" id="sidebarClose" type="button" aria-label="사이드 메뉴 닫기">←</button>
        </div>
        <nav class="sidebar-nav" aria-label="주요 메뉴">
          ${nav}
        </nav>
        <div class="sidebar-footer">
          <div class="user-mini">
            <span class="avatar">${escapeHtml(initials)}</span>
            <div>
              <strong>${escapeHtml(profile?.name || session.name || "사용자")}</strong>
              <span>${escapeHtml(profile?.department || session.studentNumber)}</span>
            </div>
          </div>
        </div>
      </aside>
      <main class="main-area">
        <header class="topbar">
          <div class="topbar-actions">
            <button class="btn btn-secondary btn-ghost mobile-menu-button" id="menuButton" type="button" aria-label="메뉴 열기">메뉴</button>
            <div class="breadcrumb"><span>HOME</span><span>/</span><strong>${escapeHtml(title || "GradQuest")}</strong></div>
          </div>
          <div class="topbar-actions">
            ${profile ? `<span class="badge">진행률 ${calculateProgress(profile)}%</span>` : ""}
            <button class="btn btn-ghost" id="logoutButton" type="button">로그아웃</button>
          </div>
        </header>
        <div id="pageContent"></div>
      </main>
    </div>
    <aside class="first-use-guide ${firstUseGuideExpanded ? "expanded" : "collapsed"}" id="firstUseGuide" aria-label="GradQuest 처음 이용 가이드">
      <button class="first-use-guide-tab" id="firstUseGuideToggle" type="button" aria-controls="firstUseGuidePanel" aria-expanded="${firstUseGuideExpanded}">
        <span>처음 이용 가이드</span><i aria-hidden="true">?</i>
      </button>
      <div class="first-use-guide-panel" id="firstUseGuidePanel">
        <span class="guide-resize-handle guide-resize-horizontal" data-guide-resize="horizontal" title="가로 크기 조절" aria-hidden="true"></span>
        <span class="guide-resize-handle guide-resize-vertical" data-guide-resize="vertical" title="세로 크기 조절" aria-hidden="true"></span>
        <span class="guide-resize-handle guide-resize-diagonal" data-guide-resize="diagonal" title="가로·세로 크기 조절" aria-hidden="true"></span>
        <div class="first-use-guide-head">
          <div><span>First guide</span><strong>GradQuest, 처음이신가요?</strong></div>
          <button id="firstUseGuideCollapse" type="button" aria-label="처음 이용 가이드 접기" title="접기">›</button>
        </div>
        <p class="first-use-guide-intro">성적표와 비교과 활동 이수 이력을 등록하면 현재 상태부터 다음 계획까지 이어서 확인할 수 있습니다.</p>
        <ol class="first-use-guide-steps">
          <li><span>01</span><p><strong>파일을 올리면 AI가 읽어요</strong><small>성적표와 비교과 이수 이력을 한 번에 검토합니다.</small></p></li>
          <li><span>02</span><p><strong>부족한 졸업요건을 확인해요</strong><small>학점·3품·졸업평가의 현재 상태를 모아 봅니다.</small></p></li>
          <li><span>03</span><p><strong>다음 계획을 추천받아요</strong><small>다음 학기 과제와 졸업 플랜을 직접 조립합니다.</small></p></li>
        </ol>
        <div class="first-use-guide-menus">
          <div><strong>핵심 서비스</strong><span>진단 대시보드 · 이수내역·문서 등록 · 개인 로드맵</span></div>
          <div><strong>학사 도구</strong><span>조기졸업 진단 · AI 학사 도우미 · 맞춤 비교과 · 학사 일정</span></div>
        </div>
        <p class="first-use-guide-note">교과목뿐 아니라 비교과, 3품, 졸업평가, 국제어와 학사 일정도 함께 검토할 수 있습니다.</p>
        <div class="first-use-guide-actions">
          <button class="btn" id="guideVideoButton" type="button">사용법 영상 보기</button>
          <a class="text-link" href="evidence.html">파일 등록 시작</a>
        </div>
      </div>
    </aside>
    <dialog class="guide-video-dialog" id="guideVideoDialog" aria-labelledby="guideVideoTitle">
      <div class="guide-video-head">
        <div><span>60-second preview</span><h2 id="guideVideoTitle">GradQuest 사용 흐름</h2></div>
        <button id="guideVideoClose" type="button" aria-label="사용법 미리보기 닫기">×</button>
      </div>
      <div class="guide-video-flow">
        <article><span>01</span><div><strong>성적표 + 비교과 이력 등록</strong><p>이미지와 PDF를 올리고 AI가 추출한 교과목·성적·활동을 검토합니다.</p><a href="evidence.html">이수내역·문서 등록</a></div></article>
        <article><span>02</span><div><strong>현재 졸업요건 진단</strong><p>총학점, 교양, 전공, 국제어, 3품과 졸업평가의 충족 여부를 확인합니다.</p><a href="dashboard.html">진단 대시보드</a></div></article>
        <article><span>03</span><div><strong>다음 학기 계획 조립</strong><p>추천 과제를 원하는 학기에 배치하고 저장된 졸업 플랜을 다시 확인합니다.</p><a href="next-semester.html">개인 로드맵</a></div></article>
      </div>
      <p class="guide-video-caption">실제 인정 여부와 최신 기준은 GLS와 학교·학과 공지를 마지막으로 확인해 주세요.</p>
    </dialog>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  document.querySelector("#logoutButton")?.addEventListener("click", logout);
  initRevealShell();
  initFirstUseGuide(firstUseGuideKey, firstUseGuideSizeKey);

  return profile;
}

function initFirstUseGuide(storageKey, sizeStorageKey) {
  const guide = document.querySelector("#firstUseGuide");
  const toggle = document.querySelector("#firstUseGuideToggle");
  const collapse = document.querySelector("#firstUseGuideCollapse");
  const dialog = document.querySelector("#guideVideoDialog");
  if (!guide || !toggle) return;

  const getSizeLimits = () => ({
    minWidth: Math.min(300, window.innerWidth - 24),
    maxWidth: Math.max(300, Math.min(620, window.innerWidth - 24)),
    minHeight: Math.min(350, window.innerHeight - 90),
    maxHeight: Math.max(350, window.innerHeight - 90),
  });
  const applySize = (width, height) => {
    const limits = getSizeLimits();
    const nextWidth = Math.min(limits.maxWidth, Math.max(limits.minWidth, Number(width) || 370));
    const nextHeight = Math.min(limits.maxHeight, Math.max(limits.minHeight, Number(height) || guide.scrollHeight));
    guide.style.width = `${Math.round(nextWidth)}px`;
    guide.style.height = `${Math.round(nextHeight)}px`;
    return { width: Math.round(nextWidth), height: Math.round(nextHeight) };
  };
  try {
    const savedSize = JSON.parse(localStorage.getItem(sizeStorageKey));
    if (savedSize?.width && savedSize?.height) applySize(savedSize.width, savedSize.height);
  } catch {
    localStorage.removeItem(sizeStorageKey);
  }

  const setExpanded = (expanded) => {
    guide.classList.toggle("expanded", expanded);
    guide.classList.toggle("collapsed", !expanded);
    toggle.setAttribute("aria-expanded", String(expanded));
    localStorage.setItem(storageKey, expanded ? "expanded" : "collapsed");
  };

  toggle.addEventListener("click", () => setExpanded(true));
  collapse?.addEventListener("click", () => setExpanded(false));
  document.querySelector("#guideVideoButton")?.addEventListener("click", () => {
    if (typeof dialog?.showModal === "function") dialog.showModal();
  });
  document.querySelector("#guideVideoClose")?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelectorAll("[data-guide-resize]").forEach((handle) => {
    handle.addEventListener("pointerdown", (event) => {
      if (!guide.classList.contains("expanded")) return;
      event.preventDefault();
      const direction = handle.dataset.guideResize;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRect = guide.getBoundingClientRect();
      handle.setPointerCapture?.(event.pointerId);
      document.body.classList.add("guide-resizing");

      const resize = (moveEvent) => {
        const width = direction === "vertical" ? startRect.width : startRect.width + startX - moveEvent.clientX;
        const height = direction === "horizontal" ? startRect.height : startRect.height + moveEvent.clientY - startY;
        applySize(width, height);
      };
      const finish = () => {
        handle.removeEventListener("pointermove", resize);
        handle.removeEventListener("pointerup", finish);
        handle.removeEventListener("pointercancel", finish);
        document.body.classList.remove("guide-resizing");
        const rect = guide.getBoundingClientRect();
        localStorage.setItem(sizeStorageKey, JSON.stringify({ width: Math.round(rect.width), height: Math.round(rect.height) }));
      };
      handle.addEventListener("pointermove", resize);
      handle.addEventListener("pointerup", finish);
      handle.addEventListener("pointercancel", finish);
    });
  });

  window.addEventListener("resize", () => {
    if (!guide.style.width || !guide.style.height) return;
    const rect = guide.getBoundingClientRect();
    applySize(rect.width, rect.height);
  });
}

function initRevealShell() {
  const sidebar = document.querySelector("#sidebar");
  const header = document.querySelector("#siteHeader");
  const sidebarTrigger = document.querySelector("#sidebarTrigger");
  const headerTrigger = document.querySelector("#headerTrigger");
  const menuButton = document.querySelector("#menuButton");
  let sidebarPinned = false;
  let headerPinned = false;
  let sidebarTimer;
  let headerTimer;

  const setExpanded = (panel, trigger, open) => {
    panel?.classList.toggle("open", open);
    trigger?.setAttribute("aria-expanded", String(open));
  };
  const openSidebar = (pin = false) => {
    window.clearTimeout(sidebarTimer);
    sidebarPinned = pin || sidebarPinned;
    setExpanded(sidebar, sidebarTrigger, true);
  };
  const closeSidebar = () => {
    sidebarPinned = false;
    setExpanded(sidebar, sidebarTrigger, false);
  };
  const scheduleSidebarClose = () => {
    window.clearTimeout(sidebarTimer);
    if (!sidebarPinned) sidebarTimer = window.setTimeout(() => setExpanded(sidebar, sidebarTrigger, false), 260);
  };
  const openHeader = (pin = false) => {
    window.clearTimeout(headerTimer);
    headerPinned = pin || headerPinned;
    setExpanded(header, headerTrigger, true);
  };
  const closeHeader = () => {
    headerPinned = false;
    setExpanded(header, headerTrigger, false);
  };
  const scheduleHeaderClose = () => {
    window.clearTimeout(headerTimer);
    if (!headerPinned) headerTimer = window.setTimeout(() => setExpanded(header, headerTrigger, false), 260);
  };

  sidebarTrigger?.addEventListener("pointerenter", () => openSidebar());
  sidebarTrigger?.addEventListener("focus", () => openSidebar());
  sidebarTrigger?.addEventListener("click", () => {
    sidebarPinned = !sidebarPinned;
    setExpanded(sidebar, sidebarTrigger, sidebarPinned);
  });
  sidebar?.addEventListener("pointerenter", () => window.clearTimeout(sidebarTimer));
  sidebar?.addEventListener("pointerleave", scheduleSidebarClose);
  document.querySelector("#sidebarClose")?.addEventListener("click", closeSidebar);
  menuButton?.addEventListener("click", () => openSidebar(true));

  headerTrigger?.addEventListener("pointerenter", () => openHeader());
  headerTrigger?.addEventListener("focus", () => openHeader());
  headerTrigger?.addEventListener("click", () => {
    headerPinned = !headerPinned;
    setExpanded(header, headerTrigger, headerPinned);
  });
  header?.addEventListener("pointerenter", () => window.clearTimeout(headerTimer));
  header?.addEventListener("pointerleave", scheduleHeaderClose);
  document.querySelector("#headerClose")?.addEventListener("click", closeHeader);

  document.addEventListener("click", (event) => {
    if (sidebarPinned && !sidebar?.contains(event.target) && !sidebarTrigger?.contains(event.target) && !menuButton?.contains(event.target)) {
      closeSidebar();
    }
    if (headerPinned && !header?.contains(event.target) && !headerTrigger?.contains(event.target)) closeHeader();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();
      closeHeader();
    }
  });
}

export function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
