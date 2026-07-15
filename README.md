# GradQuest

성균관대학교 학생의 입학연도, 전공 형태, 이수 현황을 바탕으로 졸업요건 충족 상태와 부족 항목을 보여주는 정적 웹 MVP입니다.

## 핵심 기능

- 학번/비밀번호 기반 데모 회원가입과 로그인
- 전공, 복수전공, 연계전공, 융합트랙, 조기졸업 프로필 설정
- 4개 페르소나 데모
  - 화학공학부 + 반도체소재부품장비패키징 융합트랙
  - 문헌정보학과 + 경제학과 복수전공
  - 글로벌경영학과 단일전공
  - 소프트웨어학과 조기졸업 + 학과 지정 DS 과목 예외
- 졸업학점, 교양, 학과별 DS 지정과목 예외, 전공, 국제어수업, 3품, 졸업평가 진단
- 입력값 수정 후 전체 진행률 재계산
- GLS 성적표 이미지/PDF → Document Parse → 교과목·학점·성적·수강학기 확인 및 수정
- 챌린지스퀘어 이미지/PDF → 비교과 프로그램·이수일·시간·인증영역 확인 및 3품 연결
- 졸업요건별 인정 교과목·성적·비교과 내역 상세 조회
- 조기졸업 조건 실시간 계산
- 미완료 3품에 맞춘 비교과 프로그램 추천
- Upstage Solar Q&A 및 API 미설정 시 로컬 지식모드
- Upstage Document Parse 프록시 엔드포인트
- Contact Us/팀 소개

## 파일 구조

```text
index.html                  로그인
signup.html                 회원가입
onboarding.html             학생 프로필/문서 업로드
evidence.html               GLS·챌린지스퀘어 이수 내역 등록
transcript-review.html      Document Parse 추출값 검토
dashboard.html              졸업 진행률 대시보드
requirements.html           요건 입력 및 상세 확인
early-graduation.html       조기졸업 계산
assistant.html              AI 학사 도우미
programs.html               3품·비교과 맞춤 추천
about.html                  팀/프로그램 소개
css/styles.css              공통 디자인
js/data.js                  페르소나·규칙·계산 로직
js/*.js                     페이지별 기능
api/chat.js                 Solar 서버리스 API
api/parse.js                Document Parse 서버리스 API
```

기획 배경과 데이터 구조는 `docs/PROJECT_GUIDE.md`, 5분 발표와 데모 시나리오는 `docs/PRESENTATION_GUIDE.md`에 정리되어 있습니다.
실제 발표용 9장 PowerPoint 초안은 `outputs/GradQuest_발표자료.pptx`에서 확인할 수 있습니다.

## 로컬 실행

PowerShell에서 프로젝트 폴더로 이동한 뒤 실행합니다.

```powershell
python -m http.server 4173
```

브라우저에서 `http://localhost:4173`을 엽니다. 정적 서버에서는 Upstage API가 없으므로 AI Q&A는 로컬 지식모드로 작동합니다.

## GitHub 저장소 만들기

```powershell
git init
git add .
git commit -m "Build GradQuest MVP"
git branch -M main
git remote add origin https://github.com/계정명/gradquest.git
git push -u origin main
```

GitHub에서 먼저 빈 `gradquest` 저장소를 만든 뒤 위 명령을 실행합니다. 이미 원격 저장소가 있으면 그 주소를 사용합니다.

## 배포 방법 1: GitHub Pages

1. GitHub 저장소의 `Settings > Pages`로 이동합니다.
2. `Deploy from a branch`를 선택합니다.
3. 브랜치는 `main`, 폴더는 `/ (root)`를 선택합니다.
4. 저장 후 생성된 Pages 주소를 엽니다.

GitHub Pages에서는 로그인, 진단, 조기졸업 계산, 로컬 Q&A가 동작합니다. 서버리스 API를 실행할 수 없으므로 Solar와 Document Parse는 연결되지 않습니다.

## 배포 방법 2: GitHub + Vercel 권장

1. Vercel에서 `Add New Project`를 선택합니다.
2. GitHub의 `gradquest` 저장소를 Import합니다.
3. Framework Preset은 `Other`, Build Command는 비워둡니다.
4. Environment Variables에 아래 값을 추가합니다.

```text
UPSTAGE_API_KEY=발급받은_API_키
UPSTAGE_CHAT_MODEL=solar-pro3
```

5. Deploy를 누릅니다.

API 키는 절대로 `js` 파일이나 GitHub 저장소에 직접 적지 않습니다. 현재 기본값은 Chat `solar-pro3`, Document Parse `document-parse`이며 모델명과 API 경로는 Upstage 콘솔의 최신 문서에 맞춰 환경변수 `UPSTAGE_CHAT_MODEL`, `UPSTAGE_CHAT_URL`, `UPSTAGE_PARSE_URL`로 교체할 수 있습니다.

## 로고 이미지 추가

로고 PNG를 `assets/gradquest-logo.png`로 넣고 `assets/README.md` 안내에 따라 `brand-mark` 부분을 이미지 태그로 바꿉니다. Git에 추가한 뒤 push하면 배포 사이트에도 반영됩니다.

## 현재 MVP의 보안 범위

현재 회원가입 정보와 비밀번호는 해커톤 데모를 위해 브라우저 `localStorage`에만 저장됩니다. 실제 학생 대상 서비스로 전환할 때는 Supabase Auth 등 서버 기반 인증과 개인정보 처리 동의가 필요합니다. 실제 성적표는 서버 저장 없이 파싱 후 즉시 폐기하는 방향을 권장합니다.

## 데이터 주의사항

GradQuest의 결과는 보조 진단입니다. 입학연도별 경과조치, 전공별 예외, 졸업평가 일정은 반드시 GLS, 학교 공식 학사제도, 소속 학과사무실에서 최종 확인해야 합니다.
