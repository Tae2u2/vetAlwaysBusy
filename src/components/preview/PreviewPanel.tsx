import React, { useRef, useState } from 'react';
import { ReportData } from '../../types';
import { generateReportHTML } from '../../utils/reportGenerator';
import { Download, Mail, Printer, RefreshCw, Send } from 'lucide-react';
import emailjs from 'emailjs-com';

interface Props {
  data: ReportData;
}

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';
const CLINIC_EMAIL = process.env.REACT_APP_CLINIC_EMAIL || 'wramc@naver.com';

export const PreviewPanel: React.FC<Props> = ({ data }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [emailTo, setEmailTo] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSending, setSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const htmlContent = generateReportHTML(data);

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.print();
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `진료보고서_${data.patientInfo.name || '환자'}_${new Date().toLocaleDateString('ko-KR').replace(/\./g, '').replace(/ /g, '')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async () => {
    if (!emailTo) return;
    setSending(true);
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
        EMAILJS_PUBLIC_KEY
      );
      setEmailStatus('success');
      setEmailTo('');
      setShowEmailForm(false);
    } catch {
      setEmailStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Action bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1a3a5c] text-white rounded-xl text-sm font-semibold hover:bg-[#2a5298] transition-colors"
        >
          <Printer size={16} /> 인쇄
        </button>
        <button
          onClick={handleDownloadHTML}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          <Download size={16} /> HTML 저장
        </button>
        <button
          onClick={() => setShowEmailForm(!showEmailForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Mail size={16} /> 이메일 전송
        </button>
      </div>

      {/* Email form */}
      {showEmailForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
          <p className="text-sm font-semibold text-blue-800">이메일 전송</p>
          <p className="text-xs text-blue-600">발신: {CLINIC_EMAIL}</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={emailTo}
              onChange={e => setEmailTo(e.target.value)}
              placeholder="수신 이메일 주소"
              className="flex-1 px-3 py-2 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-sm"
            />
            <button
              onClick={handleSendEmail}
              disabled={emailSending || !emailTo}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {emailSending ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              전송
            </button>
          </div>
          {emailStatus === 'success' && (
            <p className="text-sm text-green-600 font-medium">✓ 이메일이 전송되었습니다.</p>
          )}
          {emailStatus === 'error' && (
            <p className="text-sm text-red-600">이메일 전송에 실패했습니다. EmailJS 설정을 확인해주세요.</p>
          )}
        </div>
      )}

      {/* Preview iframe */}
      <div className="flex-1 border-2 border-slate-200 rounded-2xl overflow-hidden bg-gray-100 min-h-[600px]">
        <iframe
          ref={iframeRef}
          srcDoc={htmlContent}
          className="w-full h-full border-none"
          title="보고서 미리보기"
          sandbox="allow-same-origin allow-modals"
        />
      </div>
    </div>
  );
};
