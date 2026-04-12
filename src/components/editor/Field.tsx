import React from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

export const Field: React.FC<Props> = ({ label, value, onChange, multiline, placeholder }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    )}
    {multiline ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-sm text-slate-800 resize-y transition-colors bg-white"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-sm text-slate-800 transition-colors bg-white"
      />
    )}
  </div>
);
