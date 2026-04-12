import React from 'react';
import { ImagePlus, X } from 'lucide-react';
import { UploadedImage } from '../../types';
import { MAX_IMAGES } from '../../constants';

interface Props {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
}

export const ImageAttachGrid: React.FC<Props> = ({ images, onImagesChange }) => {
  const getBySlot = (slot: number) => images.find(i => i.slotNumber === slot);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onImagesChange([
      ...images.filter(img => img.slotNumber !== slot),
      { file, previewUrl: url, slotNumber: slot },
    ]);
    e.target.value = '';
  };

  const remove = (slot: number) => {
    const img = images.find(i => i.slotNumber === slot);
    if (img) URL.revokeObjectURL(img.previewUrl);
    onImagesChange(images.filter(i => i.slotNumber !== slot));
  };

  return (
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
          const img = getBySlot(slot);
          return (
            <div key={slot} className="relative">
              <div className={`aspect-square rounded-xl border-2 overflow-hidden transition-colors ${
                img ? 'border-blue-400' : 'border-dashed border-slate-300 hover:border-blue-400'
              } bg-slate-50`}>
                {img ? (
                  <>
                    <img src={img.previewUrl} alt={`슬롯 ${slot}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => remove(slot)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                    <ImagePlus size={20} className="text-slate-300" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleSelect(e, slot)}
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
  );
};
