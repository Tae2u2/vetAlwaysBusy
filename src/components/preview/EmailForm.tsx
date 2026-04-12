import React, { useEffect, useState } from 'react';
import { RefreshCw, Send } from 'lucide-react';

const CLINIC_EMAIL = process.env.REACT_APP_CLINIC_EMAIL || 'wramc@naver.com';

interface Props {
  onSend: (emailTo: string) => Promise<void>;
  sending: boolean;
  status: 'idle' | 'success' | 'error';
}

export const EmailForm: React.FC<Props> = ({ onSend, sending, status }) => {
  const [emailTo, setEmailTo] = useState('');

  // 전송 성공 시 입력값 초기화
  useEffect(() => {
    if (status === 'success') setEmailTo('');
  }, [status]);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
      <p className="text-sm font-semibold text-blue-800">이메일 전송</p>
      <p className="text-xs text-blue-600">발신: {CLINIC_EMAIL}</p>

      <div className="flex gap-2">
        <input
          type="email"
          value={emailTo}
          onChange={e => setEmailTo(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend(emailTo)}
          placeholder="수신 이메일 주소"
          className="flex-1 px-3 py-2 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-sm"
        />
        <button
          onClick={() => onSend(emailTo)}
          disabled={sending || !emailTo}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {sending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
          전송
        </button>
      </div>

      {status === 'success' && (
        <p className="text-sm text-green-600 font-medium">✓ 이메일이 전송되었습니다.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600">이메일 전송에 실패했습니다. EmailJS 설정을 확인해주세요.</p>
      )}
    </div>
  );
};
