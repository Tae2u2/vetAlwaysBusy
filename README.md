# 🐾 우리동물메디컬센터 진료보고서 시스템

수의사가 진료 차트(PDF/DOCX)를 업로드하면 Claude AI가 자동으로 외과 의뢰 보고서를 생성해주는 시스템입니다.

---

## 기술 스택

- React 18 + TypeScript
- TanStack Query (React Query v5)
- Tailwind CSS v3
- Claude API (Anthropic)
- mammoth.js (DOCX 파싱)
- pdfjs-dist (PDF 파싱)
- bcryptjs (비밀번호 해시)
- EmailJS (이메일 전송)

---

## 시작하기

### 1. 패키지 설치
npm install

### 2. 환경 변수 설정
cp .env.example .env
→ .env 파일에서 EmailJS 설정 입력

### 3. 개발 서버 실행
npm start

### 4. 프로덕션 빌드
npm run build
---

## 이미지 슬롯 매핑

- 슬롯 1-2: 혈액 검사
- 슬롯 3: VCM 검사
- 슬롯 4-5: X-ray (DR)
- 슬롯 6-7: CT
- 슬롯 8-10: 수술 과정

---

## 향후 확장 예정
- 회원가입 / 로그인 (백엔드 연동)
- 결제 시스템
- 보고서 히스토리 저장
# vetAlwaysBusy
