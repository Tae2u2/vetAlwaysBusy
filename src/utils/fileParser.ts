import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// v3: point worker to the local build (CRA copies it via public URL trick)
// eslint-disable-next-line @typescript-eslint/no-var-requires
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = (textContent.items as any[])
      .map((item) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};

export const extractTextFromDocx = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    return extractTextFromPDF(file);
  } else if (ext === 'docx' || ext === 'doc') {
    return extractTextFromDocx(file);
  }

  throw new Error('지원하지 않는 파일 형식입니다. PDF 또는 DOCX 파일을 사용해주세요.');
};
