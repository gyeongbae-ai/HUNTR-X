# GradQuest GitHub + Upstage API 연결 가이드

## 1. 현재 프로젝트 상태

GradQuest는 이미 Vercel Serverless API 구조를 갖고 있습니다.

- `api/chat.js`: Upstage Solar Chat API 프록시
- `api/parse.js`: Upstage Document Parse/Document Digitization API 프록시
- `js/assistant.js`: 프론트에서 `/api/chat` 호출
- `js/evidence.js`, `js/onboarding.js`: 프론트에서 `/api/parse` 호출

중요: Upstage API Key는 절대 `js/` 파일이나 HTML에 직접 넣지 않습니다. GitHub에 올라가면 안 되므로 Vercel 환경변수에만 등록합니다.

## 2. GitHub에 올리기

GitHub에서 빈 저장소를 먼저 만듭니다. 예: `gradquest`

이 프로젝트 폴더에서 PowerShell을 열고 아래 명령을 실행합니다.

```powershell
git init
git add .
git commit -m "Build GradQuest MVP with Upstage API proxy"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_ID/gradquest.git
git push -u origin main
```

이미 GitHub 저장소가 있다면 `YOUR_GITHUB_ID/gradquest.git` 부분만 본인 저장소 주소로 바꿉니다.

## 3. Vercel에 배포하기

GitHub Pages는 서버리스 API를 실행할 수 없어서 Upstage API 연결에는 적합하지 않습니다. Upstage 기능까지 시연하려면 Vercel 배포를 권장합니다.

1. Vercel 접속
2. `Add New Project`
3. GitHub의 `gradquest` 저장소 Import
4. Framework Preset: `Other`
5. Build Command: 비워두기
6. Output Directory: 비워두기
7. Environment Variables에 아래 값 추가

```text
UPSTAGE_API_KEY=발급받은_Upstage_API_Key
UPSTAGE_CHAT_MODEL=solar-pro3
UPSTAGE_CHAT_URL=https://api.upstage.ai/v1/chat/completions
UPSTAGE_PARSE_URL=https://api.upstage.ai/v1/document-digitization
```

8. Deploy

## 4. Upstage API Key 발급 후 넣을 곳

Upstage Console에서 API Key를 발급받은 뒤 Vercel 프로젝트의
`Settings > Environment Variables`에 `UPSTAGE_API_KEY`로 등록합니다.

로컬 테스트를 하고 싶다면 `.env.example`을 참고해 `.env.local`을 만들 수 있습니다. 단, `.env.local`은 GitHub에 올리면 안 됩니다.

## 5. 연결 확인 방법

배포 후 아래 기능을 확인합니다.

- `assistant.html`: 질문 입력 후 Solar 답변이 나오면 `/api/chat` 연결 성공
- `evidence.html`: GLS/챌린지스퀘어 이미지 또는 PDF 업로드 후 인식 결과가 나오면 `/api/parse` 연결 성공

API Key가 없거나 Vercel 환경변수가 빠져 있으면 화면에서 로컬 샘플 모드 또는 오류 메시지가 보일 수 있습니다.

## 6. 제출 시 설명 문장

GradQuest는 프론트엔드에서 API Key를 직접 노출하지 않고, Vercel Serverless Function을 통해 Upstage Solar Chat API와 Document Parse API를 호출합니다. 이를 통해 학생의 졸업요건 질문에 답변하고, GLS/챌린지스퀘어 문서 이미지를 구조화된 이수내역으로 변환하는 흐름을 구현했습니다.
