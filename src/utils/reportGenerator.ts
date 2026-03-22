import { ReportData, UploadedImage } from '../types';
import { HOSPITAL_INFO } from '../constants';

const getImageBySlot = (images: UploadedImage[], slot: number): string => {
  const img = images.find(i => i.slotNumber === slot);
  return img ? img.previewUrl : '';
};

export const generateReportHTML = (data: ReportData): string => {
  const { patientInfo, images } = data;

  const renderSection = (title: string, content: string, imageSlots: number[] = []) => {
    if (!content && imageSlots.every(s => !getImageBySlot(images, s))) return '';
    
    const imgHTML = imageSlots
      .map(slot => {
        const url = getImageBySlot(images, slot);
        if (!url) return '';
        return `<div class="img-wrap"><img src="${url}" alt="검사 이미지 ${slot}"/></div>`;
      })
      .filter(Boolean)
      .join('');

    return `
      <section class="report-section">
        <h2 class="section-title">${title}</h2>
        ${content ? `<div class="section-body">${content.replace(/\n/g, '<br/>')}</div>` : ''}
        ${imgHTML ? `<div class="img-grid">${imgHTML}</div>` : ''}
      </section>`;
  };

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>외과 의뢰 보고서 - ${patientInfo.name}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 13px;
    color: #1a1a2e;
    background: #f4f6fa;
    line-height: 1.7;
  }
  
  .page {
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    box-shadow: 0 4px 32px rgba(26,58,92,0.10);
  }

  /* ── HEADER ── */
  .header {
    background: linear-gradient(135deg, #1a3a5c 0%, #2a5298 60%, #4a90d9 100%);
    padding: 36px 48px 28px;
    display: flex;
    align-items: center;
    gap: 24px;
    position: relative;
    overflow: hidden;
  }
  .header::after {
    content: '';
    position: absolute;
    right: -40px; bottom: -40px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
  .header-logo {
    width: 72px; height: 72px;
    background: white;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  .header-clinic {
    flex: 1;
  }
  .header-clinic-since {
    font-size: 10px;
    color: rgba(255,255,255,0.7);
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 300;
  }
  .header-clinic-name {
    font-size: 26px;
    font-weight: 700;
    color: white;
    letter-spacing: -0.5px;
    line-height: 1.2;
    margin: 2px 0 4px;
  }
  .header-clinic-en {
    font-size: 11px;
    color: rgba(255,255,255,0.75);
    letter-spacing: 1px;
  }
  .header-contact {
    text-align: right;
    color: rgba(255,255,255,0.85);
    font-size: 11.5px;
    line-height: 1.9;
    flex-shrink: 0;
  }
  .header-contact strong { color: white; font-weight: 600; }

  /* ── TITLE BAND ── */
  .title-band {
    background: #f0f5ff;
    border-left: 5px solid #2a5298;
    padding: 18px 48px;
  }
  .title-band h1 {
    font-size: 20px;
    font-weight: 700;
    color: #1a3a5c;
    letter-spacing: -0.3px;
  }
  .title-band .subtitle {
    font-size: 13px;
    color: #4a90d9;
    font-weight: 500;
    margin-top: 2px;
  }

  /* ── PATIENT INFO ── */
  .patient-card {
    margin: 28px 48px;
    border: 1.5px solid #dde6f4;
    border-radius: 12px;
    overflow: hidden;
  }
  .patient-card-header {
    background: #1a3a5c;
    color: white;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  .patient-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .patient-row {
    display: flex;
    border-bottom: 1px solid #eef2fa;
    border-right: 1px solid #eef2fa;
  }
  .patient-row:nth-child(even) { border-right: none; }
  .patient-row:last-child, .patient-row:nth-last-child(2) { border-bottom: none; }
  .patient-label {
    background: #f7f9fd;
    padding: 10px 16px;
    font-size: 11.5px;
    color: #6b7a99;
    font-weight: 600;
    min-width: 90px;
    display: flex;
    align-items: center;
    border-right: 1px solid #eef2fa;
  }
  .patient-value {
    padding: 10px 16px;
    font-size: 13px;
    color: #1a1a2e;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
  .patient-value.highlight {
    color: #1a3a5c;
    font-weight: 700;
    font-size: 14px;
  }
  .referral-tag {
    display: inline-block;
    background: #e8f0fa;
    color: #2a5298;
    border-radius: 20px;
    padding: 2px 12px;
    font-size: 12px;
    font-weight: 600;
  }

  /* ── SECTIONS ── */
  .content { padding: 0 48px 48px; }
  
  .report-section {
    margin-top: 28px;
    page-break-inside: avoid;
  }
  
  .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #1a3a5c;
    border-left: 4px solid #4a90d9;
    padding: 6px 0 6px 14px;
    margin-bottom: 12px;
    background: linear-gradient(to right, #f0f5ff, transparent);
  }
  
  .section-body {
    font-size: 12.5px;
    color: #2d3748;
    line-height: 1.85;
    padding: 12px 16px;
    background: #fafbfd;
    border: 1px solid #eef2fa;
    border-radius: 8px;
  }

  /* ── IMAGES ── */
  .img-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
    margin-top: 12px;
  }
  .img-wrap {
    border: 1.5px solid #dde6f4;
    border-radius: 8px;
    overflow: hidden;
    background: #000;
  }
  .img-wrap img {
    width: 100%;
    height: 180px;
    object-fit: contain;
    display: block;
  }

  /* ── FOOTER ── */
  .footer {
    background: #1a3a5c;
    padding: 24px 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
  }
  .footer-text {
    color: rgba(255,255,255,0.8);
    font-size: 11.5px;
    line-height: 1.8;
  }
  .footer-brand {
    color: white;
    font-size: 13px;
    font-weight: 700;
    text-align: right;
  }
  .footer-brand span { display: block; font-size: 10px; font-weight: 300; color: rgba(255,255,255,0.6); margin-top: 2px; }

  /* ── PRINT ── */
  @media print {
    body { background: white; }
    .page { box-shadow: none; max-width: 100%; }
    .report-section { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <header class="header">
    <div class="header-logo">🐾</div>
    <div class="header-clinic">
      <div class="header-clinic-since">SINCE 1999</div>
      <div class="header-clinic-name">우리동물메디컬센터</div>
      <div class="header-clinic-en">Woori Animal Medical Center 24시</div>
    </div>
    <div class="header-contact">
      <strong>${HOSPITAL_INFO.address}</strong><br/>
      Tel. ${HOSPITAL_INFO.tel}<br/>
      E-mail. ${HOSPITAL_INFO.email}
    </div>
  </header>

  <!-- TITLE -->
  <div class="title-band">
    <h1>외과 의뢰 보고서</h1>
    <div class="subtitle">Surgical Referral Report</div>
  </div>

  <!-- PATIENT INFO -->
  <div class="patient-card">
    <div class="patient-card-header">📋 환자 정보 · Patient Information</div>
    <div class="patient-grid">
      <div class="patient-row">
        <div class="patient-label">환자명</div>
        <div class="patient-value highlight">${patientInfo.name}${patientInfo.patientId ? ` (${patientInfo.patientId})` : ''}</div>
      </div>
      <div class="patient-row">
        <div class="patient-label">종 / 품종</div>
        <div class="patient-value">${patientInfo.species}${patientInfo.breed ? ` / ${patientInfo.breed}` : ''}</div>
      </div>
      <div class="patient-row">
        <div class="patient-label">성별 / 나이</div>
        <div class="patient-value">${patientInfo.gender}${patientInfo.age ? ` / ${patientInfo.age}` : ''}</div>
      </div>
      <div class="patient-row">
        <div class="patient-label">체중</div>
        <div class="patient-value">${patientInfo.weight || '—'}</div>
      </div>
      <div class="patient-row">
        <div class="patient-label">수술일자</div>
        <div class="patient-value">${patientInfo.surgeryDate || '—'}</div>
      </div>
      <div class="patient-row">
        <div class="patient-label">의뢰병원</div>
        <div class="patient-value"><span class="referral-tag">${patientInfo.referralHospital || '—'}</span></div>
      </div>
    </div>
  </div>

  <!-- SECTIONS -->
  <div class="content">
    ${renderSection('1. 주호소 및 임상 병력', data.chiefComplaint, [])}
    ${renderSection('2. 수술 전 평가 – 혈액 검사', data.bloodTests, [1, 2])}
    ${renderSection('3. 수술 전 평가 – VCM 검사', data.vcmFindings, [3])}
    ${renderSection('4. DR (X-ray) 소견', data.xrayFindings, [4, 5])}
    ${renderSection('5. US (초음파) 소견', data.ultrasoundFindings, [])}
    ${renderSection('6. CT 소견', data.ctFindings, [6, 7])}
    ${renderSection('7. 수술 과정', data.surgicalProcedure, [8, 9, 10])}
    ${renderSection('8. 수술 후 관리 및 계획', data.postopManagement, [])}
  </div>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="footer-text">
      진료를 의뢰해 주심에 깊은 감사를 드립니다.<br/>
      본 보고서에 대해 궁금하신 점은 언제든 본 센터로 문의해 주시기 바랍니다.
    </div>
    <div class="footer-brand">
      우리동물메디컬센터 외과팀 드림
      <span>Woori Animal Medical Center</span>
    </div>
  </footer>

</div>
</body>
</html>`;
};
