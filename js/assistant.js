import { escapeHtml, initAppShell } from "./common.js";
import { getAssistantMetadataContext, getLocalAnswer, OFFICIAL_SOURCES } from "./data.js";

const profile = initAppShell({ page: "assistant", title: "AI 학사 도우미" });
if (!profile) throw new Error("Profile required");

const suggestions = [
  "지금 가장 부족한 졸업요건이 뭐야?",
  "조기졸업 가능성을 계산해줘",
  ...(profile.dsEducation.exception ? ["소프트웨어학과 DS 예외가 뭐야?"] : []),
  "3품 인증 현황을 알려줘",
  "전공학점은 얼마나 남았어?",
  "부족한 전공학점을 어떤 수업으로 채우면 돼?",
  "미완료 3품은 어떤 활동으로 채울 수 있어?",
  "졸업평가에서 뭘 해야 해?",
];
const initialMetadata = getAssistantMetadataContext("", profile);

document.querySelector("#pageContent").innerHTML = `
  <div class="page-content">
    <div class="page-header">
      <div>
        <p class="eyebrow">Solar academic assistant</p>
        <h1>AI 학사 도우미</h1>
        <p>${escapeHtml(profile.department)} ${profile.admissionYear}학번의 입력값과 조사된 졸업요건을 연결해 답변합니다.</p>
      </div>
      <span class="badge badge-success" id="aiMode">로컬 지식모드</span>
    </div>

    <div class="assistant-layout">
      <aside class="assistant-side">
        <h3>추천 질문</h3>
        <p class="field-hint">현재 프로필을 기준으로 답변해요.</p>
        <div class="metadata-strip">
          <span>${escapeHtml(initialMetadata.profileMetadata.admissionYear)}학번</span>
          <span>${escapeHtml(initialMetadata.profileMetadata.department)}</span>
          <span>${escapeHtml(initialMetadata.profileMetadata.degreeTypeLabel)}</span>
        </div>
        ${suggestions.map((question) => `<button class="question-chip" type="button" data-question="${escapeHtml(question)}">${escapeHtml(question)}</button>`).join("")}
        <div class="alert alert-warning" style="margin-top:18px">AI 답변은 참고용입니다. 수치와 마감일은 학교 공식 공지를 확인하세요.</div>
      </aside>
      <section class="assistant-main">
        <div class="chat-log" id="chatLog" aria-live="polite">
          <div class="message message-assistant">안녕하세요, ${escapeHtml(profile.name)}님. 현재 ${escapeHtml(profile.department)} 프로필이 연결되어 있어요. 졸업학점, ${profile.dsEducation.exception ? "DS 지정과목, " : ""}전공, 3품, 졸업평가, 조기졸업 중 궁금한 내용을 물어보세요.<span class="message-meta">GradQuest · 조사자료 기반</span></div>
          <button class="chat-scroll-bottom hidden" id="chatScrollBottom" type="button" aria-label="대화 맨 아래로 이동">↓</button>
        </div>
        <form class="chat-form" id="chatForm">
          <textarea id="question" rows="1" placeholder="예: 이번 학기에 무엇부터 채워야 해?" required></textarea>
          <button class="btn" type="submit">질문하기</button>
        </form>
      </section>
    </div>

    <p class="footer-note">답변 기준: ${OFFICIAL_SOURCES.slice(0, 2).map((source) => `<a class="text-link" href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a>`).join(" · ")}</p>
    <section class="upstage-resource-bar" aria-label="Upstage AI 공식 리소스">
      <div>
        <span class="upstage-resource-mark">UP</span>
        <div><strong>Upstage AI Resources</strong><span>Solar 모델을 직접 체험하거나 개발 연동을 시작하세요.</span></div>
      </div>
      <div class="upstage-resource-actions">
        <a class="btn btn-secondary" href="https://console.upstage.ai/playground/chat" target="_blank" rel="noreferrer">Playground Upstage</a>
        <a class="btn" href="https://console.upstage.ai/docs/getting-started" target="_blank" rel="noreferrer">Start Using Upstage AI</a>
      </div>
    </section>
  </div>`;

const chatLog = document.querySelector("#chatLog");
const form = document.querySelector("#chatForm");
const questionInput = document.querySelector("#question");
const modeBadge = document.querySelector("#aiMode");
const scrollBottomButton = document.querySelector("#chatScrollBottom");

function updateScrollBottomButton() {
  const hasOverflow = chatLog.scrollHeight > chatLog.clientHeight + 8;
  const isNearBottom = chatLog.scrollHeight - chatLog.scrollTop - chatLog.clientHeight < 36;
  scrollBottomButton.classList.toggle("hidden", !hasOverflow || isNearBottom);
}

function formatAssistantText(text) {
  return escapeHtml(String(text || ""))
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

function setMessageContent(message, text, role) {
  const body = document.createElement("div");
  body.className = "message-body";
  if (role === "assistant") {
    body.innerHTML = formatAssistantText(text);
  } else {
    body.textContent = text;
  }
  message.replaceChildren(body);
}

function addMessage(text, role, meta = "") {
  const message = document.createElement("div");
  message.className = `message message-${role}`;
  setMessageContent(message, text, role);
  if (meta) {
    const metaNode = document.createElement("span");
    metaNode.className = "message-meta";
    metaNode.textContent = meta;
    message.append(metaNode);
  }
  chatLog.insertBefore(message, scrollBottomButton);
  chatLog.scrollTop = chatLog.scrollHeight;
  requestAnimationFrame(updateScrollBottomButton);
  return message;
}

async function ask(question) {
  const metadataContext = getAssistantMetadataContext(question, profile);
  addMessage(question, "user", "나");
  const loading = addMessage("답변을 정리하고 있어요...", "assistant");
  questionInput.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, profile, metadataContext }),
    });
    if (!response.ok) throw new Error("AI API unavailable");
    const data = await response.json();
    setMessageContent(loading, data.answer, "assistant");
    const meta = document.createElement("span");
    meta.className = "message-meta";
    meta.textContent = "Upstage Solar · 프로필 및 규칙 기반";
    loading.append(meta);
    modeBadge.textContent = "Upstage Solar 연결됨";
    modeBadge.className = "badge badge-success";
  } catch {
    setMessageContent(loading, getLocalAnswer(question, profile), "assistant");
    const meta = document.createElement("span");
    meta.className = "message-meta";
    meta.textContent = "GradQuest 로컬 지식모드";
    loading.append(meta);
    modeBadge.textContent = "로컬 지식모드";
    modeBadge.className = "badge badge-warning";
  }
  requestAnimationFrame(updateScrollBottomButton);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = questionInput.value.trim();
  if (question) ask(question);
});

document.querySelectorAll("[data-question]").forEach((button) => {
  button.addEventListener("click", () => ask(button.dataset.question));
});

questionInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

chatLog.addEventListener("scroll", updateScrollBottomButton, { passive: true });
scrollBottomButton.addEventListener("click", () => {
  chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: "smooth" });
});
new ResizeObserver(updateScrollBottomButton).observe(chatLog);
updateScrollBottomButton();
