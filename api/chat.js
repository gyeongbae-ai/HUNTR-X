const UPSTAGE_CHAT_URL = process.env.UPSTAGE_CHAT_URL || "https://api.upstage.ai/v1/chat/completions";
const UPSTAGE_CHAT_MODEL = process.env.UPSTAGE_CHAT_MODEL || "solar-pro3";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.UPSTAGE_API_KEY) {
    return res.status(503).json({ error: "UPSTAGE_API_KEY is not configured" });
  }

  const { question, profile } = req.body || {};
  if (!question || !profile) {
    return res.status(400).json({ error: "question and profile are required" });
  }

  const profileContext = {
    admissionYear: profile.admissionYear,
    campus: profile.campus,
    department: profile.department,
    degreeType: profile.degreeTypeLabel,
    secondaryProgram: profile.secondaryProgram,
    currentSemester: profile.currentSemester,
    gpa: profile.gpa,
    totalCredits: profile.totalCredits,
    coreGeneral: profile.coreGeneral,
    balancedGeneral: profile.balancedGeneral,
    dsEducation: profile.dsEducation,
    primaryMajor: profile.primaryMajor,
    secondaryMajor: profile.secondaryMajor,
    internationalTotal: profile.internationalTotal,
    internationalMajor: profile.internationalMajor,
    poom: profile.poom,
    graduationEvaluation: profile.graduationEvaluation,
    notes: profile.notes,
  };

  const systemPrompt = `당신은 성균관대학교 졸업요건 안내 서비스 GradQuest의 학사 도우미입니다.
아래 학생 프로필과 구조화된 요건 데이터만 기준으로 답변하세요.
확실하지 않은 학과별 예외, 마감일, 최신 공지는 추측하지 말고 '확인 필요'라고 표시하세요.
답변은 한국어로 간결하게 작성하고, 현재 상태·부족분·다음 행동을 구분하세요.
마지막에 '최종 판정은 GLS와 학과사무실에서 확인하세요.'라는 안내를 포함하세요.

학생 데이터:
${JSON.stringify(profileContext, null, 2)}`;

  try {
    const response = await fetch(UPSTAGE_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSTAGE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: UPSTAGE_CHAT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: String(question).slice(0, 2000) },
        ],
        temperature: 0.2,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: payload?.error?.message || "Upstage API request failed" });
    }

    const answer = payload?.choices?.[0]?.message?.content;
    if (!answer) return res.status(502).json({ error: "Empty answer from Upstage API" });
    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error" });
  }
}
