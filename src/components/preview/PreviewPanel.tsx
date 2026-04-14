import React, { useRef, useState } from "react";
import { ReportData } from "../../types";
import { generateReportHTML } from "../../utils/reportGenerator";
import { HOSPITAL_INFO } from "../../constants";
import { ActionBar } from "./ActionBar";
import { EmailForm } from "./EmailForm";
import { ReportPreviewFrame } from "./ReportPreviewFrame";

const BREVO_API_KEY = process.env.REACT_APP_BREVO_API_KEY || "";
const SENDER_EMAIL = process.env.REACT_APP_CLINIC_EMAIL || HOSPITAL_INFO.email;

interface BrevoPayload {
  sender: { name: string; email: string };
  to: { email: string }[];
  subject: string;
  htmlContent: string;
  attachment: { content: string; name: string }[];
}

function buildEmailHtml(data: ReportData): string {
  const petName = data.patientInfo.name || "환자";
  const petBreed = data.patientInfo.breed || "";
  const referringHospital = data.patientInfo.referralHospital || "";
  const referDate = new Date().toLocaleDateString("ko-KR");

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Malgun Gothic', Arial, sans-serif; color: #222; margin: 0; padding: 0; background: #f7f9fc; }
    .wrap { max-width: 600px; margin: 36px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .hdr  { background: #1a3a5c; padding: 28px 36px; }
    .hdr h1 { color: #fff; margin: 0; font-size: 20px; }
    .hdr p  { color: #a8c4e0; margin: 6px 0 0; font-size: 12px; }
    .bdy  { padding: 32px 36px; }
    .bdy p { font-size: 14px; line-height: 1.9; color: #333; margin: 0 0 16px; }
    .tbl  { width: 100%; border-collapse: collapse; margin: 20px 0; background: #f0f5fb; border-radius: 8px; overflow: hidden; }
    .tbl td { padding: 9px 14px; font-size: 13px; color: #444; border-bottom: 1px solid #e2eaf4; }
    .tbl td:first-child { font-weight: 600; color: #1a3a5c; width: 120px; }
    .tbl tr:last-child td { border-bottom: none; }
    .ftr  { background: #f0f5fb; padding: 18px 36px; text-align: center; }
    .ftr p { font-size: 11px; color: #888; margin: 3px 0; }
    .ftr strong { color: #1a3a5c; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <h1>우리동물메디컬센터 외과 의뢰 보고서</h1>
      <p>Woori Animal Medical Center · Surgical Referral Report</p>
    </div>
    <div class="bdy">
      <p>
        안녕하세요 수의사 선생님,<br />
        <strong>${referringHospital}</strong>에서 의뢰하신
        <strong>${petName}</strong> 환자의 진료 기록입니다.<br />
        자세한 내용은 첨부된 PDF 파일을 확인해 주시기 바랍니다.
      </p>
      <table class="tbl">
        <tr><td>환자명</td><td>${petName}</td></tr>
        <tr><td>품종</td><td>${petBreed}</td></tr>
        <tr><td>의뢰 병원</td><td>${referringHospital}</td></tr>
        <tr><td>발송일</td><td>${referDate}</td></tr>
      </table>
      <p>
        문의 사항이 있으시면 언제든지 연락 주시기 바랍니다.<br />
        감사합니다.<br /><br />
        <strong>우리동물메디컬센터 외과팀</strong> 수의사 드림.
      </p>
    </div>
    <div class="ftr">
      <p><strong>${HOSPITAL_INFO.name}</strong></p>
      <p>${HOSPITAL_INFO.address} · TEL ${HOSPITAL_INFO.tel}</p>
    </div>
  </div>
</body>
</html>`.trim();
}

async function generatePDFBase64(htmlContent: string): Promise<string> {
  const { jsPDF } = await import("jspdf");
  await import("html2canvas");

  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;left:-9999px;top:0;width:794px;background:white;";
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  await new Promise<void>((resolve) => {
    pdf.html(container, {
      callback: () => {
        document.body.removeChild(container);
        resolve();
      },
      margin: [10, 10, 10, 10],
      autoPaging: "text",
      x: 0,
      y: 0,
      width: 190,
      windowWidth: 794,
    });
  });

  return pdf.output("datauristring").split(",")[1];
}

interface Props {
  data: ReportData;
}

export const PreviewPanel: React.FC<Props> = ({ data }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const htmlContent = generateReportHTML(data);

  const handlePrint = () => {
    iframeRef.current?.contentWindow?.print();
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `진료보고서_${data.patientInfo.name || "환자"}_${new Date()
      .toLocaleDateString("ko-KR")
      .replace(/\./g, "")
      .replace(/ /g, "")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async (emailTo: string) => {
    setEmailSending(true);
    setEmailStatus("idle");
    try {
      const pdfBase64 = await generatePDFBase64(htmlContent);
      const petName = data.patientInfo.name || "환자";

      const payload: BrevoPayload = {
        sender: {
          name: `${HOSPITAL_INFO.name}`,
          email: SENDER_EMAIL,
        },
        to: [{ email: emailTo }],
        subject: `[우리동물메디컬센터] ${petName} 외과 의뢰 보고서`,
        htmlContent: buildEmailHtml(data),
        attachment: [
          {
            content: pdfBase64,
            name: `${petName}_Report.pdf`,
          },
        ],
      };

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Brevo API error: ${response.status}`);
      }

      setEmailStatus("success");
    } catch {
      setEmailStatus("error");
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <ActionBar
        onPrint={handlePrint}
        onDownload={handleDownload}
        showEmailForm={showEmailForm}
        onEmailToggle={() => setShowEmailForm((v) => !v)}
      />

      {showEmailForm && (
        <EmailForm
          onSend={handleSendEmail}
          sending={emailSending}
          status={emailStatus}
        />
      )}

      <ReportPreviewFrame htmlContent={htmlContent} iframeRef={iframeRef} />
    </div>
  );
};
