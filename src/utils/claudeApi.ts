import { ReportData } from "../types";

export const parseReportWithClaude = async (
  text: string,
  // apiKey 파라미터 제거! 더 이상 프론트에서 키 안 씀
): Promise<Partial<ReportData>> => {
  const response = await fetch("/api/chat", {
    // 자기 서버로
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }), // text만 전달
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Claude API 호출 실패");
  }

  const data = await response.json();
  const content = data.content[0]?.text || "";

  // 이 아래는 기존 코드 그대로
  const cleanJson = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    return JSON.parse(cleanJson);
  } catch {
    throw new Error("AI 응답을 파싱하는데 실패했습니다.");
  }
};
