import React from 'react';

interface Props {
  htmlContent: string;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export const ReportPreviewFrame: React.FC<Props> = ({ htmlContent, iframeRef }) => (
  <div className="flex-1 border-2 border-slate-200 rounded-2xl overflow-hidden bg-gray-100 min-h-[600px]">
    <iframe
      ref={iframeRef}
      srcDoc={htmlContent}
      className="w-full h-full min-h-[600px] border-none"
      title="보고서 미리보기"
      sandbox="allow-same-origin allow-modals"
    />
  </div>
);
