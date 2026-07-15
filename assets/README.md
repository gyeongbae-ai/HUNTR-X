# GradQuest 이미지 넣는 곳

성균관대학교 또는 팀 로고 파일을 이 폴더에 넣습니다.

- 권장 파일명: `skku-logo.png`, `gradquest-logo.png`
- 권장 형식: 투명 배경 PNG 또는 WebP
- 권장 크기: 가로 600px 이상

현재 화면은 로고 파일이 없어도 보이도록 `GQ` 텍스트 마크를 사용합니다. 실제 이미지를 넣은 뒤 각 HTML과 `js/common.js`의 `<span class="brand-mark">GQ</span>` 부분을 아래처럼 바꾸면 됩니다.

```html
<img class="brand-image" src="assets/gradquest-logo.png" alt="GradQuest" />
```

