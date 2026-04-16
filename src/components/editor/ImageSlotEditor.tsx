import React, { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { SectionImage } from '../../types';

interface Props {
  images: SectionImage[];
  onImagesChange: (images: SectionImage[]) => void;
}

export const ImageSlotEditor: React.FC<Props> = ({ images, onImagesChange }) => {
  const replaceRefs = useRef<(HTMLInputElement | null)[]>([]);
  const addRef = useRef<HTMLInputElement | null>(null);

  const handleAdd = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    onImagesChange([...images, { file, previewUrl, caption: '' }]);
  };

  const handleReplace = (index: number, file: File) => {
    URL.revokeObjectURL(images[index].previewUrl);
    const previewUrl = URL.createObjectURL(file);
    const updated = images.map((img, i) =>
      i === index ? { ...img, file, previewUrl } : img
    );
    onImagesChange(updated);
  };

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(images[index].previewUrl);
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const handleCaption = (index: number, caption: string) => {
    onImagesChange(images.map((img, i) => (i === index ? { ...img, caption } : img)));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleAdd(file);
  };

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <p className="text-xs font-semibold text-slate-400 mb-2 tracking-wide uppercase">이미지</p>
      <div className="flex flex-wrap gap-3">
        {images.map((img, index) => (
          <div key={index} className="flex-1 min-w-[148px] max-w-[200px]">
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="relative group">
                <img
                  src={img.previewUrl}
                  alt={`이미지 ${index + 1}`}
                  className="w-full h-28 object-contain bg-slate-900 cursor-pointer"
                  title="클릭하면 교체"
                  onClick={() => replaceRefs.current[index]?.click()}
                />
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-80 hover:opacity-100 hover:bg-red-600 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
              <div className="p-2">
                <input
                  type="text"
                  value={img.caption ?? ''}
                  onChange={e => handleCaption(index, e.target.value)}
                  placeholder="이미지 설명 입력..."
                  className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-400 bg-slate-50 placeholder-slate-300"
                />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={el => { replaceRefs.current[index] = el; }}
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleReplace(index, f);
                e.target.value = '';
              }}
            />
          </div>
        ))}

        {/* 이미지 추가 버튼 */}
        <div className="flex-1 min-w-[148px] max-w-[200px]">
          <button
            onClick={() => addRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full h-28 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:border-blue-400 hover:bg-blue-50 transition-colors text-slate-300 hover:text-blue-400"
          >
            <ImagePlus size={20} />
            <span className="text-xs font-medium">이미지 추가</span>
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={addRef}
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleAdd(f);
              e.target.value = '';
            }}
          />
        </div>
      </div>
    </div>
  );
};
