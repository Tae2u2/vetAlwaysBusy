import { ReportData } from "../types";
import { GenerateType, PROMPT_MAP } from "../constants";

const MAX_CHARS = 50000;

/** string[] 배열을 개조식 문자열로 변환 */
const formatList = (items: string[] | undefined): string => {
  if (!items || items.length === 0) return '';
  return items.map(item => `• ${item}`).join('\n');
};

/**
 * bloodTests: { cbc[], chemistry[], electrolyte[] } → 카테고리 헤더 포함 문자열
 */
const formatBloodTests = (bt: any): string => {
  const sections: string[] = [];
  if (bt?.cbc?.length)         sections.push(`[CBC]\n${formatList(bt.cbc)}`);
  if (bt?.chemistry?.length)   sections.push(`[Chemistry]\n${formatList(bt.chemistry)}`);
  if (bt?.electrolyte?.length) sections.push(`[Electrolyte]\n${formatList(bt.electrolyte)}`);
  return sections.join('\n\n');
};

/** Claude 새 JSON 구조 → ReportData flat 구조로 매핑 */
const mapToReportData = (raw: any): Partial<ReportData> => {
  const { patientInfo, chiefComplaint, diagnosticResults, surgicalProcedure, postopManagement } = raw;

  const surgicalText = [
    surgicalProcedure?.name ? `수술명: ${surgicalProcedure.name}` : '',
    formatList(surgicalProcedure?.details),
  ].filter(Boolean).join('\n');

  return {
    patientInfo,
    chiefComplaint:          chiefComplaint || '',
    bloodTests:              formatBloodTests(diagnosticResults?.bloodTests) || formatList(raw.bloodTests),
    vcmFindings:             formatList(raw.vcmFindings),
    xrayFindings:            formatList(diagnosticResults?.xrayFindings) || formatList(raw.xrayFindings),
    ultrasoundFindings:      formatList(diagnosticResults?.ultrasoundFindings) || formatList(raw.ultrasoundFindings),
    ctFindings:              formatList(raw.ctFindings),
    ophthalmologyFindings:   formatList(raw.ophthalmologyFindings),
    surgicalProcedure:       surgicalText,
    postopManagement:        formatList(postopManagement),
  };
};

export const parseReportWithClaude = async (
  text: string,
  apiKey: string,
  type: GenerateType = 'report',
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
      system: PROMPT_MAP[type],
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

  // 앞뒤 설명 텍스트를 무시하고 {...} 블록만 추출
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const cleanJson = jsonMatch ? jsonMatch[0].trim() : '';

  try {
    if (!cleanJson) throw new Error('JSON 블록을 찾을 수 없습니다.');
    const raw = JSON.parse(cleanJson);
    return mapToReportData(raw);
  } catch (e) {
    console.error('[Claude 파싱 실패] raw content:', content);
    console.error('[Claude 파싱 실패] error:', e);
    throw new Error("AI 응답을 파싱하는데 실패했습니다.");
  }
};
