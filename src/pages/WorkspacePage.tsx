import React, { useState } from "react";
import { Eye, PenLine } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { AppHeader, Step } from "../components/layout/AppHeader";
import { UploadStep } from "../components/upload/UploadStep";
import { ReportEditor } from "../components/editor/ReportEditor";
import { PreviewPanel } from "../components/preview/PreviewPanel";
import { ReportData } from "../types";
import { GenerateType } from "../constants";
import { extractTextFromFile } from "../utils/fileParser";
import { parseReportWithClaude } from "../utils/claudeApi";

const EMPTY_DATA: ReportData = {
  patientInfo: {
    name: "",
    patientId: "",
    species: "",
    breed: "",
    gender: "",
    age: "",
    weight: "",
    surgeryDate: "",
    referralHospital: "",
  },
  chiefComplaint: "",
  bloodTests: "",
  vcmFindings: "",
  xrayFindings: "",
  ultrasoundFindings: "",
  ctFindings: "",
  ophthalmologyFindings: "",
  surgicalProcedure: "",
  postopManagement: "",
  sections: [],
  images: {},
};

export const WorkspacePage: React.FC = () => {
  const { logout, apiKey } = useAuth();
  const [step, setStep] = useState<Step>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [reportData, setReportData] = useState<ReportData>(EMPTY_DATA);
  const [processing, setProcessing] = useState<'report' | 'blog' | null>(null);
  const [generateType, setGenerateType] = useState<GenerateType>('report');
  const [error, setError] = useState("");

  const runProcess = async (type: 'report' | 'blog') => {
    if (!files.length) return;
    setProcessing(type);
    setError("");
    try {
      const texts = await Promise.all(files.map(extractTextFromFile));
      const combinedText = texts.join("\n\n--- 다음 문서 ---\n\n");
      const parsed = await parseReportWithClaude(combinedText, apiKey, type);
      setReportData({
        ...EMPTY_DATA,
        ...parsed,
        patientInfo: {
          ...EMPTY_DATA.patientInfo,
          ...(parsed.patientInfo || {}),
        },
        images: {},
        sections: [],
      });
      setGenerateType(type);
      setStep("edit");
    } catch (e: any) {
      setError(e.message || "AI 분석 중 오류가 발생했습니다.");
    } finally {
      setProcessing(null);
    }
  };

  const handleProcess = () => runProcess('report');
  const handleProcessBlog = () => runProcess('blog');

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader
        step={step}
        onStepChange={setStep}
        onLogout={logout}
        patientName={reportData.patientInfo.name}
      />

      <main className="max-w-8xl mx-auto px-4 sm:px-6 py-6">
        {step === "upload" && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-slate-800">
                진료 차트 업로드
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                PDF 또는 DOCX 파일을 업로드하면 AI가 자동으로 보고서를
                생성합니다.
              </p>
            </div>
            <UploadStep
              files={files}
              onFilesChange={(files) => setFiles(files)}
              onProcess={handleProcess}
              onProcessBlog={handleProcessBlog}
              processing={processing}
              error={error}
            />
          </div>
        )}

        {step === "edit" && (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* 편집 영역 */}
            <div className="xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    내용 편집
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5">
                    AI가 추출한 내용을 확인하고 수정하세요.
                  </p>
                </div>
                <button
                  onClick={() => setStep("preview")}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a3a5c] text-white rounded-xl text-sm font-semibold hover:bg-[#2a5298] transition-colors"
                >
                  <Eye size={15} /> 미리보기
                </button>
              </div>
              <ReportEditor
                data={reportData}
                onChange={setReportData}
              />
            </div>

            {/* 실시간 미리보기 (데스크톱) */}
            <div className="hidden xl:block xl:col-span-3">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                  실시간 미리보기
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  편집 내용이 실시간으로 반영됩니다.
                </p>
              </div>
              <div className="sticky top-20">
                <PreviewPanel data={reportData} type={generateType} />
              </div>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  미리보기 · 출력
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  인쇄하거나 이메일로 전송하세요.
                </p>
              </div>
              <button
                onClick={() => setStep("edit")}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors"
              >
                <PenLine size={15} /> 다시 편집
              </button>
            </div>
            <div style={{ height: "calc(100vh - 160px)" }}>
              <PreviewPanel data={reportData} type={generateType} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
