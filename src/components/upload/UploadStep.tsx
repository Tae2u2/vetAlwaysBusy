import React from "react";
import { AlertCircle } from "lucide-react";
import { ChartFileDropzone } from "./ChartFileDropzone";
import { GenerateButton } from "./GenerateButton";

interface Props {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onProcess: () => void;
  processing: boolean;
  error: string;
}

export const UploadStep: React.FC<Props> = ({
  files,
  onFilesChange,
  onProcess,
  processing,
  error,
}) => (
  <div className="space-y-8">
    <ChartFileDropzone files={files} onFilesChange={onFilesChange} />

    {error && (
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
        <AlertCircle size={16} className="shrink-0 mt-0.5" />
        <span>{error}</span>
      </div>
    )}

    <GenerateButton
      disabled={files.length === 0}
      processing={processing}
      onClick={onProcess}
    />
  </div>
);
