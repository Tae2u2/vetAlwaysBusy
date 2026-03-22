import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { UploadStep } from "../components/upload/UploadStep";
import { ReportEditor } from "../components/editor/ReportEditor";
import { PreviewPanel } from "../components/preview/PreviewPanel";
import { ReportData, UploadedImage } from "../types";
import { extractTextFromFile } from "../utils/fileParser";
import { parseReportWithClaude } from "../utils/claudeApi";
import { LogOut, FileText, PenLine, Eye, ChevronRight } from "lucide-react";
import { HOSPITAL_INFO } from "../constants";

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
  surgicalProcedure: "",
  postopManagement: "",
  sections: [],
  images: [],
};

type Step = "upload" | "edit" | "preview";

const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: "upload", label: "파일 업로드", icon: <FileText size={15} /> },
  { key: "edit", label: "내용 편집", icon: <PenLine size={15} /> },
  { key: "preview", label: "미리보기 · 출력", icon: <Eye size={15} /> },
];

export const WorkspacePage: React.FC = () => {
  const { logout, apiKey } = useAuth();
  const [step, setStep] = useState<Step>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [reportData, setReportData] = useState<ReportData>(EMPTY_DATA);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true);
    setError("");
    try {
      // Extract text from all files
      const texts = await Promise.all(files.map(extractTextFromFile));
      const combinedText = texts.join("\n\n--- 다음 문서 ---\n\n");

      // Call Claude
      const parsed = await parseReportWithClaude(combinedText);

      setReportData({
        ...EMPTY_DATA,
        ...parsed,
        patientInfo: {
          ...EMPTY_DATA.patientInfo,
          ...(parsed.patientInfo || {}),
        },
        images,
        sections: [],
      });
      setStep("edit");
    } catch (e: any) {
      setError(e.message || "AI 분석 중 오류가 발생했습니다.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReportChange = (data: ReportData) => {
    setReportData({ ...data, images });
  };

  // Sync images into report data whenever images change
  const handleImagesChange = (newImages: UploadedImage[]) => {
    setImages(newImages);
    setReportData((prev) => ({ ...prev, images: newImages }));
  };

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1a3a5c] to-[#4a90d9] rounded-lg flex items-center justify-center text-base">
              🐾
            </div>
            <div>
              <span className="font-bold text-[#1a3a5c] text-sm">
                {HOSPITAL_INFO.name}
              </span>
              <span className="text-slate-400 text-xs ml-2">
                진료보고서 시스템
              </span>
            </div>
          </div>

          {/* Step indicator */}
          <div className="hidden sm:flex items-center gap-1">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.key}>
                <button
                  onClick={() => {
                    // Only allow going back or to already unlocked steps
                    if (
                      i <= stepIndex ||
                      (i === 2 && reportData.patientInfo.name)
                    ) {
                      setStep(s.key);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    step === s.key
                      ? "bg-[#1a3a5c] text-white"
                      : i < stepIndex
                        ? "text-blue-600 hover:bg-blue-50 cursor-pointer"
                        : "text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {s.icon}
                  {s.label}
                </button>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={14} className="text-slate-300" />
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">로그아웃</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
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
              images={images}
              onFilesChange={setFiles}
              onImagesChange={handleImagesChange}
              onProcess={handleProcess}
              processing={processing}
              error={error}
            />
          </div>
        )}

        {step === "edit" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Editor column */}
            <div>
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
                  <Eye size={15} />
                  미리보기
                </button>
              </div>
              <ReportEditor data={reportData} onChange={handleReportChange} />
            </div>

            {/* Live preview column (desktop) */}
            <div className="hidden xl:block">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                  실시간 미리보기
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  편집 내용이 실시간으로 반영됩니다.
                </p>
              </div>
              <div className="sticky top-20">
                <PreviewPanel data={reportData} />
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
                <PenLine size={15} />
                다시 편집
              </button>
            </div>
            <div style={{ height: "calc(100vh - 160px)" }}>
              <PreviewPanel data={reportData} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
