import React from 'react';
import { ChevronRight, Eye, FileText, LogOut, PenLine } from 'lucide-react';
import { HOSPITAL_INFO } from '../../constants';

export type Step = 'upload' | 'edit' | 'preview';

export const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: 'upload', label: '파일 업로드', icon: <FileText size={15} /> },
  { key: 'edit',   label: '내용 편집',   icon: <PenLine size={15} /> },
  { key: 'preview', label: '미리보기 · 출력', icon: <Eye size={15} /> },
];

interface Props {
  step: Step;
  onStepChange: (step: Step) => void;
  onLogout: () => void;
  patientName: string;
}

export const AppHeader: React.FC<Props> = ({ step, onStepChange, onLogout, patientName }) => {
  const stepIndex = STEPS.findIndex(s => s.key === step);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#1a3a5c] to-[#4a90d9] rounded-lg flex items-center justify-center text-base">
            🐾
          </div>
          <div>
            <span className="font-bold text-[#1a3a5c] text-sm">{HOSPITAL_INFO.name}</span>
            <span className="text-slate-400 text-xs ml-2">진료보고서 시스템</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="hidden sm:flex items-center gap-1">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.key}>
              <button
                onClick={() => {
                  if (i <= stepIndex || (i === 2 && patientName)) {
                    onStepChange(s.key);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  step === s.key
                    ? 'bg-[#1a3a5c] text-white'
                    : i < stepIndex
                    ? 'text-blue-600 hover:bg-blue-50 cursor-pointer'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                {s.icon}
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight size={14} className="text-slate-300" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">로그아웃</span>
        </button>
      </div>
    </header>
  );
};
