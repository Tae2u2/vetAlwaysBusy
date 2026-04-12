import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import { ReportData } from '../../types';
import { generateReportHTML } from '../../utils/reportGenerator';
import { ActionBar } from './ActionBar';
import { EmailForm } from './EmailForm';
import { ReportPreviewFrame } from './ReportPreviewFrame';

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY  = process.env.REACT_APP_EMAILJS_PUBLIC_KEY  || '';

interface Props {
  data: ReportData;
}

export const PreviewPanel: React.FC<Props> = ({ data }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const htmlContent = generateReportHTML(data);

  const handlePrint = () => {
    iframeRef.current?.contentWindow?.print();
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `진료보고서_${data.patientInfo.name || '환자'}_${
      new Date().toLocaleDateString('ko-KR').replace(/\./g, '').replace(/ /g, '')
    }.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async (emailTo: string) => {
    setEmailSending(true);
    setEmailStatus('idle');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: emailTo,
          from_name: '우리동물메디컬센터 외과팀',
          patient_name: data.patientInfo.name,
          report_date: new Date().toLocaleDateString('ko-KR'),
          message: `${data.patientInfo.name} 환자의 외과 의뢰 보고서를 첨부드립니다.`,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setEmailStatus('success');
    } catch {
      setEmailStatus('error');
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
        onEmailToggle={() => setShowEmailForm(v => !v)}
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
