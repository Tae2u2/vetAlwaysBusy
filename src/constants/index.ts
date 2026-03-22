export const HOSPITAL_INFO = {
  name: "우리동물메디컬센터",
  nameEn: "Woori Animal Medical Center",
  since: "SINCE 1999",
  address: "서울시 금천구 남부순환로 1386",
  tel: "02-853-7582",
  email: "wramc@naver.com",
  tagline: "24시",
};

export const PASSWORD_HASH =
  "$2a$10$xKNRdvIBEYoGnFEz3K4gROOmfWCjB.8MmXbFVz4Sn.u9E6gI3d2hy";
// bcrypt hash of 'vet!7582!woori'

export const REPORT_SECTIONS = [
  { id: "chiefComplaint", title: "주호소 및 임상 병력", key: "chiefComplaint" },
  { id: "preop", title: "수술 전 평가", key: "preop" },
  { id: "bloodTests", title: "혈액 검사", key: "bloodTests" },
  { id: "vcm", title: "VCM 검사", key: "vcmFindings" },
  { id: "xray", title: "DR (X-ray) 소견", key: "xrayFindings" },
  { id: "ultrasound", title: "US (초음파) 소견", key: "ultrasoundFindings" },
  { id: "ct", title: "CT 소견", key: "ctFindings" },
  { id: "surgical", title: "수술 과정", key: "surgicalProcedure" },
  { id: "postop", title: "수술 후 관리 및 계획", key: "postopManagement" },
];

export const MAX_IMAGES = 10;

export const AI_SYSTEM_PROMPT = `당신은 수의학 전문 진료 보고서 작성 보조 AI입니다.
주어진 진료 차트 내용을 분석하여 아래 항목별로 JSON 형식으로 정리해주세요.
반드시 JSON만 반환하고, 다른 텍스트는 포함하지 마세요.

반환 형식:
{
  "patientInfo": {
    "name": "환자명",
    "patientId": "환자번호",
    "species": "종",
    "breed": "품종",
    "gender": "성별",
    "age": "나이",
    "weight": "체중",
    "surgeryDate": "수술(진료)일자",
    "referralHospital": "의뢰병원"
  },
  "chiefComplaint": "주호소 및 임상 병력 내용",
  "bloodTests": "혈액 검사 결과 내용",
  "vcmFindings": "VCM 검사 내용",
  "xrayFindings": "DR(X-ray) 소견 내용",
  "ultrasoundFindings": "US(초음파) 소견 내용",
  "ctFindings": "CT 소견 내용",
  "surgicalProcedure": "수술 과정 내용 (수술명 포함)",
  "postopManagement": "수술 후 관리 및 계획 내용"
}

없는 항목은 빈 문자열("")로 두세요. 내용은 전문적이고 간결하게 정리하되 원본의 의학 용어는 그대로 유지하세요.`;
