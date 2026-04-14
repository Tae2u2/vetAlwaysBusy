import React, { useCallback, useState } from "react";
import { AlertCircle, FileText, Upload, X } from "lucide-react";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const LARGE_FILE_THRESHOLD = 5 * 1024 * 1024; // 5MB

interface Props {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export const ChartFileDropzone: React.FC<Props> = ({
  files,
  onFilesChange,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const addFiles = useCallback(
    (incoming: File[]) => {
      if (incoming.some((f) => f.size > MAX_FILE_SIZE)) {
        setSizeError(true);
        return;
      }
      const valid = incoming.filter((f) => {
        const name = f.name.toLowerCase(); // 이거 추가
        return (
          name.endsWith(".pdf") ||
          name.endsWith(".docx") ||
          name.endsWith(".doc")
        );
      });
      setSizeError(false);
      onFilesChange([...files, ...valid]);
    },
    [files, onFilesChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles],
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeFile = (idx: number) => {
    setSizeError(false);
    onFilesChange(files.filter((_, i) => i !== idx));
  };

  const hasLargeFile = files.some((f) => f.size > LARGE_FILE_THRESHOLD);
  console.log("v파일", files);
  return (
    <section>
      <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
        <FileText size={18} className="text-blue-600" />
        진료 차트 파일
        <span className="text-xs font-normal text-slate-400">
          PDF / DOCX · 다중 선택 가능
        </span>
      </h2>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
        }`}
      >
        <Upload className="mx-auto mb-3 text-blue-400" size={32} />
        <p className="text-sm font-medium text-slate-600 mb-1">
          파일을 드래그하거나 클릭하여 선택
        </p>
        <p className="text-xs text-slate-400">PDF, DOCX 파일 지원</p>
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.doc"
          onChange={handleSelect}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      {files.map((f, i) => (
        <div key={i}>
          {f.name} - {f.size}bytes {/* 이게 보이면 드롭존은 정상 */}
        </div>
      ))}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3"
            >
              <FileText size={16} className="text-blue-500 shrink-0" />
              <span className="text-sm text-slate-700 flex-1 truncate">
                {f.name}
              </span>
              <span className="text-xs text-slate-400">
                {(f.size / 1024).toFixed(0)}KB
              </span>
              <button
                onClick={() => removeFile(i)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Errors / warnings */}
      {sizeError && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-medium">
          <AlertCircle size={15} className="shrink-0" />
          파일 용량 제한(50MB)을 초과하여 업로드 불가
        </div>
      )}
      {hasLargeFile && (
        <div className="mt-2 flex items-center gap-2 text-amber-600 text-sm font-medium">
          <AlertCircle size={15} className="shrink-0" />
          용량이 커서 AI 토큰 소모가 큰 작업이 실행됩니다.
        </div>
      )}
    </section>
  );
};
