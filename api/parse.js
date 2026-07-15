export const config = {
  api: {
    bodyParser: false,
  },
};

const UPSTAGE_PARSE_URL = process.env.UPSTAGE_PARSE_URL || "https://api.upstage.ai/v1/document-digitization";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.UPSTAGE_API_KEY) {
    return res.status(503).json({ error: "UPSTAGE_API_KEY is not configured" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const response = await fetch(UPSTAGE_PARSE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSTAGE_API_KEY}`,
        "Content-Type": req.headers["content-type"],
      },
      body,
    });

    const text = await response.text();
    res.status(response.status);
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json; charset=utf-8");
    return res.send(text);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Document Parse request failed" });
  }
}
