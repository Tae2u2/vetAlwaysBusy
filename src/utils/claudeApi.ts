import { ReportData } from "../types";
import { AI_SYSTEM_PROMPT } from "../constants";

const MAX_CHARS = 50000;

export const parseReportWithClaude = async (
  text: string,
  apiKey: string,
): Promise<Partial<ReportData>> => {
  const truncated =
    text.length > MAX_CHARS
      ? text.slice(0, MAX_CHARS) + "\n\n[텍스트가 너무 길어 이하 내용은 생략되었습니다]"
      : text;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: AI_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `다음 진료 차트 내용을 분석하여 JSON 형식으로 정리해주세요:\n\n${truncated}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Claude API 호출 실패");
  }

  const data = await response.json();
  const content = data.content[0]?.text || "";

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
