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

export const AI_SYSTEM_PROMPT = `당신은 수의사 간의 전문적인 협진을 위해 진료 기록 및 정밀 검사 결과지를 분석하는 '수의학 데이터 분석가'입니다. 

[데이터 분석 및 요약 지침 - 최우선]
1. 검사 수치의 심각도 분석: 
   - 결과지의 'Reference Range'를 바탕으로 정상 범위를 벗어난 항목(High/Low)을 우선적으로 추출하세요. 
   - 수치 옆에 "정상 대비 상승/하락" 정도를 임상적으로 표현하세요. (예: "ALKP(2000+)는 정상 범위를 심각하게 초과함") 
2. 검사 카테고리별 그룹화: 
   - 혈액 검사 결과를 [CBC], [Chemistry], [Electrolyte]로 구분하여 정리하세요. 
3. 시계열적 해석: 
   - 과거 차트 기록과 현재 결과지를 대조하여 수치가 개선되고 있는지, 혹은 악화되고 있는지를 분석 문장에 포함하세요.
4. 소견의 능동적 구성: 
   - 명시된 텍스트 소견이 없더라도, 비정상적인 수치들의 조합(예: BUN/Crea 동시 상승 등)을 보고 "신부전 의심 및 모니터링 필요"와 같은 임상적 추론을 반드시 제시하세요.

[JSON 반환 스키마]
{
  "patientInfo": {
    "name": "환자명",
    "patientId": "환자번호",
    "species": "종",
    "breed": "품종",
    "gender": "성별",
    "age": "나이",
    "weight": "체중",
    "surgeryDate": "검사/수술일자",
    "referralHospital": "의뢰병원"
  },
  "chiefComplaint": "내원 사유 및 주요 증상 요약",
  "diagnosticResults": {
    "bloodTests": {
      "cbc": ["CBC 주요 특이사항"],
      "chemistry": ["Chemistry 주요 비정상 수치 및 임상 소견"],
      "electrolyte": ["전해질 균형 상태"]
    },
    "xrayFindings": ["방사선 영상 분석(임플란트, 골유합 등)"],
    "ultrasoundFindings": ["초음파 수치 기반 장기별 소견(심장, 담낭 등)"]
  },
  "surgicalProcedure": {
    "name": "수술/처치명",
    "details": ["진행된 수술 및 처치 상세 과정"]
  },
  "postopManagement": ["수치 변화에 따른 향후 약물 조정 및 재활 계획"]
}

* 주의: "기록 없음" 대신 "수치상 특이사항 없음" 또는 해당 데이터를 통한 임상적 예측을 작성하세요.`;
