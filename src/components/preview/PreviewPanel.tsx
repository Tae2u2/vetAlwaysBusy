import React, { useRef, useState } from "react";
import { ReportData } from "../../types";
import { generateHTML } from "../../utils/reportGenerator";
import { GenerateType } from "../../constants";
import { HOSPITAL_INFO } from "../../constants";
import { ActionBar } from "./ActionBar";
import { EmailForm } from "./EmailForm";
import { ReportPreviewFrame } from "./ReportPreviewFrame";
import { jsPDF } from "jspdf";
import * as html2canvasNS from "html2canvas";
const html2canvas = (html2canvasNS as any).default ?? (html2canvasNS as any);

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
      <h1>우리동물메디컬센터 진료 보고서</h1>
    </div>
    <div class="bdy">
      <p>
        안녕하세요. 우리동물메디컬센터입니다.<br />
        <strong>${referringHospital}</strong>에서 의뢰하신
        <strong>${petName}</strong> 환자의 진료 기록입니다.<br />
        자세한 내용은 첨부된 PDF 파일을 확인해 주시기 바랍니다.
      </p>
      <table class="tbl">
        <tr><td>환자명</td><td>${petName}</td></tr>
        <tr><td>품종</td><td>${petBreed}</td></tr>
        <tr><td>발송일</td><td>${referDate}</td></tr>
      </table>
      <p>
        문의 사항이 있으시면 언제든지 연락 주시기 바랍니다.<br />
         감사합니다.<br /><br />
        <strong>우리동물메디컬센터</strong> 드림.
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
  type?: GenerateType;
}

export const PreviewPanel: React.FC<Props> = ({ data, type = "report" }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const htmlContent = generateHTML(data, type);

  const handlePrint = () => {
    iframeRef.current?.contentWindow?.print();
  };

  const handleDownload = async () => {
    const marginMm = 10;
    const pageW = 210;
    const pageH = 297;
    const contentW = pageW - marginMm * 2; // 190mm
    const contentH = pageH - marginMm * 2; // 277mm
    const sectionGapMm = 5;

    const fileName = `진료보고서_${data.patientInfo.name || "환자"}_${new Date()
      .toLocaleDateString("ko-KR")
      .replace(/\./g, "")
      .replace(/ /g, "")}.pdf`;

    const container = document.createElement("div");
    container.style.cssText =
      "position:fixed;left:-9999px;top:0;width:794px;background:white;";
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    try {
      const imgs = Array.from(container.querySelectorAll("img"));
      await Promise.all(
        imgs.map((img) =>
          img.complete && img.naturalWidth > 0
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              }),
        ),
      );

      let sections = Array.from(
        container.querySelectorAll("[data-pdf-section]"),
      ) as HTMLElement[];

      if (sections.length === 0) {
        console.warn(
          "[PDF] data-pdf-section 없음 — 전체 컨테이너를 단일 섹션으로 처리",
        );
        sections = [container];
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      let cursorY = marginMm;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        if (canvas.width === 0 || canvas.height === 0) continue;

        const imgW = contentW;
        const imgH = (canvas.height * imgW) / canvas.width;

        if (imgH > contentH) {
          // 섹션이 A4 한 페이지보다 큰 경우 — 내부 슬라이싱
          const pxPerMm = canvas.width / imgW;
          let sliceTop = 0;

          while (sliceTop < canvas.height) {
            const availableH = pageH - marginMm - cursorY;
            const slicePx = Math.min(
              availableH * pxPerMm,
              canvas.height - sliceTop,
            );

            if (slicePx <= 0) {
              pdf.addPage();
              cursorY = marginMm;
              continue;
            }

            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = slicePx;
            sliceCanvas
              .getContext("2d")!
              .drawImage(
                canvas,
                0,
                sliceTop,
                canvas.width,
                slicePx,
                0,
                0,
                canvas.width,
                slicePx,
              );

            const sliceImgH = slicePx / pxPerMm;
            pdf.addImage(
              sliceCanvas.toDataURL("image/png"),
              "PNG",
              marginMm,
              cursorY,
              imgW,
              sliceImgH,
            );
            cursorY += sliceImgH;
            sliceTop += slicePx;

            if (sliceTop < canvas.height) {
              pdf.addPage();
              cursorY = marginMm;
            }
          }
        } else {
          // 일반 섹션 — 페이지에 안 들어가면 다음 페이지로
          if (cursorY > marginMm && cursorY + imgH > pageH - marginMm) {
            pdf.addPage();
            cursorY = marginMm;
          }
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            marginMm,
            cursorY,
            imgW,
            imgH,
          );
          cursorY += imgH;
        }

        if (i < sections.length - 1) {
          cursorY += sectionGapMm;
          if (cursorY >= pageH - marginMm) {
            pdf.addPage();
            cursorY = marginMm;
          }
        }
      }

      pdf.save(fileName);
    } catch (err) {
      console.error("PDF 생성 실패:", err);
      alert("PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      document.body.removeChild(container);
    }
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
