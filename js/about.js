import { escapeHtml, initAppShell } from "./common.js";

const profile = initAppShell({ page: "about", title: "Contact Us", requireProfile: false });

document.querySelector("#pageContent").innerHTML = `
  <div class="page-content">
    <section class="huntrix-hero">
      <div class="huntrix-hero-copy">
        <p class="eyebrow">Contact us · Team 헌트릭스💖</p>
        <h1>What our<br />journey looks like.</h1>
        <p>성균관대학교 학생 세 명이 복잡한 졸업요건을 더 선명하고 아름다운 경험으로 바꾸고 있습니다.</p>
        <div class="huntrix-tags"><span>DOCUMENT AI</span><span>STUDENT UX</span><span>TEAM OF 3</span></div>
      </div>
      <div class="huntrix-hero-visual"><img src="assets/huntrix-team.png" alt="파스텔 톤의 팀 헌트릭스💖 이미지" /><a class="huntrix-image-source" href="https://www.google.com/search?q=%ED%97%8C%ED%8A%B8%EB%A6%AD%EC%8A%A4+%EC%9D%B4%EB%AF%B8%EC%A7%80&udm=2" target="_blank" rel="noopener noreferrer">이미지 출처: Google 이미지 검색</a></div>
    </section>

    <section class="panel">
      <div class="panel-header"><div><h2>우리가 해결하려는 문제</h2><p>학사제도 문서와 학생 개인의 이수내역 사이를 연결합니다.</p></div></div>
      <p>졸업요건은 학사 안내, 학과 공지, GLS, 챌린지스퀘어 등 여러 곳에 나뉘어 있습니다. 특히 복수전공, 연계전공, 융합트랙, 조기졸업 학생은 자신에게 적용되는 기준을 직접 조합해야 합니다. GradQuest는 이 문서들을 구조화하고 현재 이수 상태와 비교해, 부족한 요건과 다음 행동을 이해하기 쉬운 언어로 보여줍니다.</p>
      <div class="metric-grid">
        <div class="metric"><span>프로젝트</span><strong>GradQuest</strong></div>
        <div class="metric"><span>팀</span><strong>헌트릭스💖</strong></div>
        <div class="metric"><span>대상</span><strong>성균관대학교 학부생</strong></div>
      </div>
    </section>

    <section class="panel team-panel">
      <div class="panel-header"><div><h2>Team 헌트릭스💖</h2><p>각자 주축을 맡되 데이터 검증과 데모 완성은 함께 책임집니다.</p></div></div>
      <div class="team-grid">
        <article class="team-member team-member-purple team-member-profile">
          <div class="team-profile-head">
            <img class="team-photo" src="assets/team-koo-eunjin.png" alt="구은진 프로필 사진" />
            <div><span class="team-role">Data & Schema</span><h3>구은진</h3></div>
          </div>
          <p class="member-meta">
            성균관대학교 글로벌경영학과 25학번<br />
            <a href="mailto:ku0515@g.skku.edu">Email: ku0515@g.skku.edu</a><br />
            <a href="https://www.instagram.com/enj_kk/" target="_blank" rel="noopener noreferrer">Insta: "@enj_kk"</a>
          </p>
          <p class="member-work">Graduation Rules · Schema<br />학사자료 구조화와 판정 규칙 검증</p>
        </article>
        <article class="team-member team-member-lilac team-member-profile">
          <div class="team-profile-head">
            <img class="team-photo" src="assets/team-yang-seonggyeong.png" alt="양성경 프로필 사진" />
            <div><span class="team-role">Product & Pitch</span><h3>양성경</h3></div>
          </div>
          <p class="member-meta">
            성균관대학교 문헌정보학과 23학번<br />
            <a href="mailto:yangsk0310@g.skku.edu">Email: yangsk0310@g.skku.edu</a><br />
            <a href="https://www.instagram.com/did_u._c/" target="_blank" rel="noopener noreferrer">Insta: "@did_u._c"</a>
          </p>
          <p class="member-work">Product · Storytelling<br />사용자 경험, 발표자료와 데모 스토리</p>
        </article>
        <article class="team-member team-member-pink team-member-profile">
          <div class="team-profile-head">
            <img class="team-photo" src="pic/yoo.jpg" alt="유경배 프로필 사진" />
            <div>
              <span class="team-role">Frontend & AI</span>
              <h3>유경배</h3>
            </div>
          </div>
          <p class="member-meta">
            성균관대학교 화학공학부 24학번<br />
            <a href="mailto:gyeongbae@g.skku.edu">Email: gyeongbae@g.skku.edu</a><br />
            <a href="https://www.instagram.com/yo0o.baelly?igsh=MTg5anhnNnVlZXU4Nw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">Insta: "@yo0o.baelly"</a>
          </p>
          <p class="member-work">Frontend · Upstage API<br />웹사이트 구현과 AI 기능 연결</p>
        </article>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header"><div><h2>AI Document Builders Challenge 2026</h2><p>흩어진 정보를 실제로 작동하는 웹 서비스로 구현합니다.</p></div></div>
      <p>GradQuest는 성균관대학교 대학혁신과공유센터와 Upstage가 함께하는 AI Document Builders Challenge에서 개발되었습니다. 학교의 비정형 학사 문서를 학생별 체크리스트와 대화형 안내로 바꾸는 것이 우리의 목표입니다.</p>
      <div class="badge-row">
        <span class="badge">Document Parse</span>
        <span class="badge">Information Extraction</span>
        <span class="badge">Solar Q&A</span>
        <span class="badge">Graduation Rules Engine</span>
      </div>
    </section>

    <section class="panel rubric-panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Demo day rubric</p>
          <h2>평가기준에 맞춘 GradQuest의 답</h2>
          <p>대주제인 “흩어진 정보를, 쓸 수 있는 서비스로”를 졸업요건 진단이라는 뾰족한 학생 문제로 구현했습니다.</p>
        </div>
      </div>
      <div class="rubric-grid">
        <article class="rubric-card">
          <span>Service Differentiation</span>
          <h3>범용 챗봇으로 대체하기 어려운 이유</h3>
          <p>ChatGPT에 질문하면 사용자가 조건을 직접 설명해야 하지만, GradQuest는 학번·전공·복수전공·융합트랙·조기졸업 여부와 이수내역을 함께 계산해 개인별 부족 조건을 바로 보여줍니다.</p>
        </article>
        <article class="rubric-card">
          <span>Data Architecture & Process</span>
          <h3>정보가 결과로 이어지는 흐름</h3>
          <p>GLS 성적표, 챌린지스퀘어 이수내역, 학과 졸업요건, 공식 공지 링크를 구조화해 요건별 인정내역과 다음 행동으로 연결합니다.</p>
        </article>
        <article class="rubric-card">
          <span>Solution Depth</span>
          <h3>단순 요약이 아닌 판정 로직</h3>
          <p>총학점, 전공, 교양, DS 예외, 3품, 졸업평가, 조기졸업 조건을 분리해 계산하고 각 요건마다 연결된 과목과 비교과 내역을 확인할 수 있습니다.</p>
        </article>
        <article class="rubric-card">
          <span>Effective Use of Upstage</span>
          <h3>Document AI와 Solar 적용</h3>
          <p>Document Parse는 GLS·챌린지스퀘어 이미지/PDF에서 이수내역을 추출하고, Solar는 학생 프로필과 규칙 데이터를 바탕으로 학사 Q&A를 답변합니다.</p>
        </article>
      </div>
    </section>

    <section class="panel pipeline-panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Information pipeline</p>
          <h2>어떤 정보를, 어디서, 왜 가져오는가</h2>
          <p>심사위원이 데이터 처리 과정을 한눈에 볼 수 있도록 서비스 흐름을 명확히 정리했습니다.</p>
        </div>
      </div>
      <div class="pipeline-flow">
        <div><span>1</span><strong>정보 소스</strong><p>GLS 성적표, 챌린지스퀘어, 학과 공지, SKKU 공식 공지</p></div>
        <div><span>2</span><strong>Upstage 처리</strong><p>Document Parse로 문서·이미지에서 과목, 학점, 비교과, 인증영역 추출</p></div>
        <div><span>3</span><strong>규칙 매칭</strong><p>입학연도, 전공형태, DS 예외, 졸업평가 기준과 대조</p></div>
        <div><span>4</span><strong>사용자 결과</strong><p>부족 학점, 인정내역, 추천 과목, 3품 활동, AI 상담으로 연결</p></div>
      </div>
    </section>

    <div class="contact-callout" style="margin-top:18px">
      <div><h2>GradQuest를 함께 개선해주세요.</h2><p>잘못된 요건이나 추가하고 싶은 학과가 있다면 팀 헌트릭스💖에 알려주세요.</p></div>
      <button class="btn btn-secondary" id="openContactForm" type="button">Contact Us</button>
    </div>

    <section class="panel hidden" id="contactFormPanel" style="margin-top:18px">
      <div class="panel-header"><div><h2>의견 남기기</h2><p>작성한 내용은 GitHub의 새 이슈 화면에서 최종 확인 후 등록할 수 있습니다.</p></div></div>
      <form id="contactForm">
        <div class="form-grid">
          <div class="field"><label for="contactName">이름</label><input id="contactName" name="name" value="${escapeHtml(profile?.name || "")}" required /></div>
          <div class="field"><label for="contactCategory">문의 유형</label><select id="contactCategory" name="category"><option>졸업요건 오류</option><option>학과 추가 요청</option><option>기능 제안</option><option>기타</option></select></div>
          <div class="field form-span-2"><label for="contactMessage">내용</label><textarea id="contactMessage" name="message" rows="5" required placeholder="확인이 필요한 학과, 입학연도, 요건을 함께 적어주세요."></textarea></div>
        </div>
        <div class="form-actions"><button class="btn" type="submit">GitHub Issue 작성</button></div>
      </form>
    </section>

    <p class="footer-note">현재 로그인 사용자: ${escapeHtml(profile?.name || "프로필 설정 전")} · 의견과 오류 제보는 <a class="text-link" href="https://github.com/gyeongbae-ai/HUNTR-X/issues" target="_blank" rel="noopener noreferrer">GradQuest GitHub Issues</a>에서 관리합니다.</p>
  </div>`;

document.querySelector("#openContactForm").addEventListener("click", () => {
  const panel = document.querySelector("#contactFormPanel");
  panel.classList.toggle("hidden");
  if (!panel.classList.contains("hidden")) document.querySelector("#contactName").focus();
});

document.querySelector("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get("name")).trim();
  const category = String(data.get("category"));
  const message = String(data.get("message")).trim();
  const params = new URLSearchParams({
    title: `[${category}] ${message.slice(0, 60)}`,
    body: [
      "### 문의자",
      name,
      "",
      "### 문의 유형",
      category,
      "",
      "### 내용",
      message,
      "",
      "---",
      "GradQuest Contact Us 페이지에서 작성되었습니다.",
    ].join("\n"),
  });
  window.open(
    `https://github.com/gyeongbae-ai/HUNTR-X/issues/new?${params.toString()}`,
    "_blank",
    "noopener,noreferrer",
  );
});
