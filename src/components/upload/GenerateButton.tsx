import React from 'react';
import { Stethoscope, BookOpen } from 'lucide-react';

const VARIANT_CONFIG = {
  report: {
    label: 'AI로 보고서 생성하기',
    processingLabel: 'AI가 분석 중입니다...',
    Icon: Stethoscope,
    className: 'bg-gradient-to-r from-[#1a3a5c] to-[#2a5298]',
  },
  blog: {
    label: 'AI로 블로그 초안 생성하기',
    processingLabel: 'AI가 작성 중입니다...',
    Icon: BookOpen,
    className: 'bg-gradient-to-r from-[#2d6a4f] to-[#40916c]',
  },
};

interface Props {
  disabled: boolean;
  processing: boolean;
  onClick: () => void;
  variant?: 'report' | 'blog';
}

export const GenerateButton: React.FC<Props> = ({ disabled, processing, onClick, variant = 'report' }) => {
  const { label, processingLabel, Icon, className } = VARIANT_CONFIG[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled || processing}
      className={`w-full ${className} text-white py-4 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2`}
    >
      {processing ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {processingLabel}
        </>
      ) : (
        <>
          <Icon size={18} />
          {label}
        </>
      )}
    </button>
  );
};
