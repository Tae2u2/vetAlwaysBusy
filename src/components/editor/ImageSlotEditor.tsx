import React, { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { SectionImage } from '../../types';

interface Props {
  images: SectionImage[];
  onImagesChange: (images: SectionImage[]) => void;
}

export const ImageSlotEditor: React.FC<Props> = ({ images, onImagesChange }) => {
  const replaceRefs = useRef<(HTMLInputElement | null)[]>([]);
  const addRef = useRef<HTMLInputElement | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleAdd = (files: File[]) => {
    const newImages = files.map(file => ({ file, previewUrl: URL.createObjectURL(file), caption: '' }));
    onImagesChange([...images, ...newImages]);
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

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) handleAdd(files);
  };

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndexRef.current !== null) setDragOverIndex(index);
  };

  const handleDropReorder = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = dragIndexRef.current;
    if (fromIndex === null || fromIndex === toIndex) {
      setDragOverIndex(null);
      setDraggingIndex(null);
      return;
    }
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onImagesChange(updated);
    dragIndexRef.current = null;
    setDragOverIndex(null);
    setDraggingIndex(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
    setDraggingIndex(null);
  };

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <p className="text-xs font-semibold text-slate-400 mb-2 tracking-wide uppercase">이미지</p>
      <div className="flex flex-wrap gap-3">
        {images.map((img, index) => (
          <div
            key={index}
            className={`flex-1 min-w-[148px] max-w-[200px] transition-opacity ${draggingIndex === index ? 'opacity-40' : 'opacity-100'}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDrop={e => handleDropReorder(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className={`border rounded-xl overflow-hidden bg-white shadow-sm transition-all ${dragOverIndex === index && draggingIndex !== index ? 'border-blue-400 ring-2 ring-blue-300' : 'border-slate-200'}`}>
              <div className="relative group">
                <img
                  src={img.previewUrl}
                  alt={`이미지 ${index + 1}`}
                  draggable={false}
                  className="w-full h-28 object-contain bg-slate-900 cursor-grab active:cursor-grabbing"
                  title="드래그로 순서 변경 | 클릭으로 교체"
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
            onDrop={handleFileDrop}
            className="w-full h-28 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:border-blue-400 hover:bg-blue-50 transition-colors text-slate-300 hover:text-blue-400"
          >
            <ImagePlus size={20} />
            <span className="text-xs font-medium">이미지 추가</span>
          </button>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={addRef}
            onChange={e => {
              const files = Array.from(e.target.files ?? []).filter(f => f.type.startsWith('image/'));
              if (files.length > 0) handleAdd(files);
              e.target.value = '';
            }}
          />
        </div>
      </div>
    </div>
  );
};
