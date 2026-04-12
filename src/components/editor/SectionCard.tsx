import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  title: string;
  badge?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<Props> = ({ title, badge, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-white hover:from-blue-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-blue-500 rounded-full" />
          <span className="font-bold text-slate-700 text-sm">{title}</span>
          {badge && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp size={16} className="text-slate-400" />
          : <ChevronDown size={16} className="text-slate-400" />
        }
      </button>
      {open && (
        <div className="px-5 py-5 space-y-4 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
};
