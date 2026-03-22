export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, system } = req.body; // 프론트에서 text만 받음

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY, // 환경변수에서 읽기
      "anthropic-version": "2023-06-01",
      // 'anthropic-dangerous-direct-browser-access' 제거! 서버엔 필요없음
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system, // ⚠️ 이건 아래 설명 참고
      messages: [
        {
          role: "user",
          content: `다음 진료 차트 내용을 분석하여 JSON 형식으로 정리해주세요:\n\n${text}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    return res
      .status(response.status)
      .json({ error: error.error?.message || "Claude API 호출 실패" });
  }

  const data = await response.json();
  return res.status(200).json(data); // 파싱은 프론트에서 기존 코드 그대로 사용
}
