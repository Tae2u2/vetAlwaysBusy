import React from 'react';
import { Download, Mail, Printer } from 'lucide-react';

interface Props {
  onPrint: () => void;
  onDownload: () => void;
  showEmailForm: boolean;
  onEmailToggle: () => void;
}

export const ActionBar: React.FC<Props> = ({ onPrint, onDownload, showEmailForm, onEmailToggle }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <button
      onClick={onPrint}
      className="flex items-center gap-2 px-4 py-2.5 bg-[#1a3a5c] text-white rounded-xl text-sm font-semibold hover:bg-[#2a5298] transition-colors"
    >
      <Printer size={16} /> 인쇄
    </button>
    <button
      onClick={onDownload}
      className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
    >
      <Download size={16} /> HTML 저장
    </button>
    <button
      onClick={onEmailToggle}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
        showEmailForm ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      <Mail size={16} /> 이메일 전송
    </button>
  </div>
);
