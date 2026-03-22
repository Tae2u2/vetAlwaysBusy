import React, { useCallback, useState } from 'react';
import { UploadedImage } from '../../types';
import { FileText, ImagePlus, Upload, X, AlertCircle } from 'lucide-react';
import { MAX_IMAGES } from '../../constants';

interface Props {
  files: File[];
  images: UploadedImage[];
  onFilesChange: (files: File[]) => void;
  onImagesChange: (images: UploadedImage[]) => void;
  onProcess: () => void;
  processing: boolean;
  error: string;
}

export const UploadStep: React.FC<Props> = ({
  files, images, onFilesChange, onImagesChange, onProcess, processing, error
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFilesDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter(
      f => f.name.endsWith('.pdf') || f.name.endsWith('.docx') || f.name.endsWith('.doc')
    );
    onFilesChange([...files, ...dropped]);
  }, [files, onFilesChange]);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    onFilesChange([...files, ...selected]);
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    onFilesChange(files.filter((_, i) => i !== idx));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const existing = images.filter(img => img.slotNumber !== slot);
    onImagesChange([...existing, { file, previewUrl: url, slotNumber: slot }]);
    e.target.value = '';
  };

  const removeImage = (slot: number) => {
    const img = images.find(i => i.slotNumber === slot);
    if (img) URL.revokeObjectURL(img.previewUrl);
    onImagesChange(images.filter(i => i.slotNumber !== slot));
  };

  const getImageBySlot = (slot: number) => images.find(i => i.slotNumber === slot);

  return (
    <div className="space-y-8">
      {/* Chart files upload */}
      <section>
        <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
          <FileText size={18} className="text-blue-600" />
          진료 차트 파일
          <span className="text-xs font-normal text-slate-400">PDF / DOCX · 다중 선택 가능</span>
        </h2>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFilesDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
          }`}
        >
          <Upload className="mx-auto mb-3 text-blue-400" size={32} />
          <p className="text-sm font-medium text-slate-600 mb-1">파일을 드래그하거나 클릭하여 선택</p>
          <p className="text-xs text-slate-400">PDF, DOCX 파일 지원</p>
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.doc"
            onChange={handleFilesSelect}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <FileText size={16} className="text-blue-500 shrink-0" />
                <span className="text-sm text-slate-700 flex-1 truncate">{f.name}</span>
                <span className="text-xs text-slate-400">{(f.size / 1024).toFixed(0)}KB</span>
                <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Images upload */}
      <section>
        <h2 className="text-base font-bold text-slate-700 mb-1 flex items-center gap-2">
          <ImagePlus size={18} className="text-blue-600" />
          첨부 이미지
          <span className="text-xs font-normal text-slate-400">최대 10장 · 슬롯 번호로 보고서 위치 지정</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          슬롯 번호 = 보고서 내 이미지 순서 (1번~10번)
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: MAX_IMAGES }, (_, i) => i + 1).map(slot => {
            const img = getImageBySlot(slot);
            return (
              <div key={slot} className="relative">
                <div className={`aspect-square rounded-xl border-2 overflow-hidden transition-colors ${
                  img ? 'border-blue-400' : 'border-dashed border-slate-300 hover:border-blue-400'
                } bg-slate-50`}>
                  {img ? (
                    <>
                      <img src={img.previewUrl} alt={`슬롯 ${slot}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(slot)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-full cursor-pointer gap-1">
                      <ImagePlus size={20} className="text-slate-300" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleImageSelect(e, slot)}
                      />
                    </label>
                  )}
                </div>
                <div className="text-center text-xs font-semibold text-slate-500 mt-1">{slot}번</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Process button */}
      <button
        onClick={onProcess}
        disabled={files.length === 0 || processing}
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
    </div>
  );
};

// Need to import this properly
const Stethoscope = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
    <circle cx="20" cy="10" r="2"/>
  </svg>
);
