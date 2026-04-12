import React from 'react';
import { Stethoscope } from 'lucide-react';

interface Props {
  disabled: boolean;
  processing: boolean;
  onClick: () => void;
}

export const GenerateButton: React.FC<Props> = ({ disabled, processing, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled || processing}
    className="w-full bg-gradient-to-r from-[#1a3a5c] to-[#2a5298] text-white py-4 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
  >
    {processing ? (
      <>
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        AI가 분석 중입니다...
      </>
    ) : (
      <>
        <Stethoscope size={18} />
        AI로 보고서 생성하기
      </>
    )}
  </button>
);
