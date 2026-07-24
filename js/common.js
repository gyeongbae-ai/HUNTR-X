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
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  document.querySelector("#logoutButton")?.addEventListener("click", logout);
  initRevealShell();

  return profile;
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
