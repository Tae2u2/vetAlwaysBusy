# CLAUDE.md

## 프로젝트 개요

**우리동물메디컬센터 진료보고서 시스템 (VET-REPORT)**

수의사가 진료 차트(PDF/DOCX)를 업로드하면 Claude AI가 자동으로 외과 의뢰 보고서를 생성하는 React SPA. 보고서 편집, 미리보기, 인쇄, 이메일 전송 기능 포함.

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | React 19 + TypeScript (strict) |
| 스타일링 | Tailwind CSS v3 |
| 상태 관리 | React Context API + useState |
| AI | Claude API (claude-sonnet-4-6) |
| 파일 파싱 | pdfjs-dist (PDF), mammoth.js (DOCX) |
| 인증 | bcryptjs |
| 이메일 | EmailJS |
| 빌드 | Create React App (react-scripts 5) |

---

## 프로젝트 구조

```
src/
├── components/
│   ├── editor/ReportEditor.tsx     # 보고서 편집 (환자정보 + 8개 섹션)
│   ├── preview/PreviewPanel.tsx    # 미리보기, 인쇄, 다운로드, 이메일
│   └── upload/UploadStep.tsx       # 파일/이미지 업로드 (드래그앤드롭)
├── hooks/
│   └── useAuth.tsx                 # AuthContext + useAuth hook
├── pages/
│   ├── LoginPage.tsx               # 비밀번호 + API 키 입력
│   └── WorkspacePage.tsx           # 3단계 워크플로우 (upload → edit → preview)
├── types/index.ts                  # TypeScript 인터페이스 (ReportData 등)
├── constants/index.ts              # 병원 정보, AI 시스템 프롬프트, 섹션 정의
└── utils/
    ├── auth.ts                     # 비밀번호 검증, sessionStorage 관리
    ├── claudeApi.ts                # Anthropic API 호출
    ├── fileParser.ts               # PDF/DOCX 텍스트 추출
    └── reportGenerator.ts          # HTML 보고서 생성 (인라인 CSS 포함)
```

---

## 핵심 데이터 흐름

```
PDF/DOCX 업로드
    → fileParser.ts (텍스트 추출)
    → claudeApi.ts (AI 분석 → JSON 응답)
    → ReportData 객체
    → ReportEditor (사용자 편집)
    → reportGenerator.ts (HTML 생성)
    → PreviewPanel (인쇄 / 다운로드 / 이메일)
```

---

## 환경변수

| 변수 | 파일 | 용도 |
|------|------|------|
| `REACT_APP_PASSWORD_HASH` | `.env` | bcrypt 해시 |
| `REACT_APP_EMAILJS_SERVICE_ID` | `.env.local` | EmailJS 서비스 ID |
| `REACT_APP_EMAILJS_TEMPLATE_ID` | `.env.local` | EmailJS 템플릿 ID |
| `REACT_APP_EMAILJS_PUBLIC_KEY` | `.env.local` | EmailJS 공개 키 |
| `REACT_APP_CLINIC_EMAIL` | `.env.local` | 수신 이메일 주소 |

- `.env`, `.env.local` 모두 `.gitignore`에 포함 — 절대 커밋하지 않는다.
- Claude API 키는 로그인 시 사용자가 직접 입력 → `sessionStorage`에만 저장.

---

## 인증 구조

- 로그인: 시스템 비밀번호(bcrypt 검증) + Claude API 키 입력
- 상태 저장: `sessionStorage` (탭 종료 시 자동 삭제)
- `AuthContext`로 전역 관리, `useAuth()` hook으로 접근

---

## 보고서 섹션 구성 (8개)

`src/constants/index.ts`에 정의됨.

1. 주호소 및 임상 병력
2. 수술 전 평가
3. 혈액 검사 (이미지 슬롯 1–2)
4. VCM 검사 (이미지 슬롯 3)
5. DR (X-ray) 소견 (이미지 슬롯 4–5)
6. US (초음파) 소견
7. CT 소견 (이미지 슬롯 6–7)
8. 수술 과정 (이미지 슬롯 8–10)

---

## 개발 규칙

### 보안
- 비밀번호, API 키, 시크릿 등 민감한 값은 코드나 주석 어디에도 절대 남기지 않는다.
- 로컬 환경이라도 예외 없다. 민감한 값은 반드시 `.env` 파일로 관리한다.
- 기존에 주석으로 남겨진 민감한 값이 있으면 즉시 삭제한다.

### 코드 스타일
- TypeScript strict mode 준수.
- 환경변수는 `process.env.REACT_APP_*` 형식 사용 (CRA 프로젝트).
- 병원 브랜드 색상 `#1a3a5c` / 폰트 `Noto Sans KR` 유지.
- 이미지 객체 URL 생성 시 `revokeObjectURL()` 반드시 호출.

### Claude API
- 모델: `claude-sonnet-4-6`
- 브라우저 직접 호출 시 `anthropic-dangerous-direct-browser-access: true` 헤더 필수.
- AI 응답은 JSON 파싱 전 마크다운 코드블록 제거 처리.

### PDF.js
- `postinstall` 스크립트로 worker 파일 자동 복사 (`public/pdf.worker.min.js`).
- pdfjs-dist 버전 변경 시 worker 호환성 확인 필요.
