import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini API client with User-Agent header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Smart Contract AI Security Audit endpoint
app.post("/api/audit-contract", async (req, res) => {
  try {
    const { code, contractName, network, language } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Solidity source code is required" });
    }

    const ai = getGeminiClient();
    const systemPrompt = `You are a world-class Web3 Smart Contract Security Auditor & Blockchain Security Researcher.
Analyze the provided Solidity/EVM smart contract source code for security vulnerabilities, economic exploits, MEV risks, and gas inefficiencies.
Return a structured JSON response matching this schema:
{
  "contractName": "string",
  "securityScore": number (0 to 100, where 100 is perfectly secure),
  "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SECURE",
  "summary": "string (Executive summary in 2-3 sentences)",
  "vulnerabilities": [
    {
      "id": "string (e.g., VULN-01)",
      "title": "string",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFORMATIONAL",
      "swcId": "string (e.g., SWC-107)",
      "description": "string",
      "impact": "string",
      "affectedLines": "string",
      "remediation": "string",
      "fixedCodeSnippet": "string"
    }
  ],
  "gasOptimizations": [
    {
      "title": "string",
      "description": "string",
      "estimatedSavings": "string",
      "suggestion": "string"
    }
  ],
  "architectureQuality": {
    "testCoverageRecommendation": "string",
    "accessControlAudit": "string",
    "upgradeabilitySafety": "string"
  },
  "verdict": "string"
}
Respond strictly with valid JSON only.`;

    const userPrompt = `Contract Name: ${contractName || "SmartContract"}\nNetwork: ${network || "PlayBlock / EVM"}\nLanguage: ${language || "en"}\n\nSolidity Code:\n\`\`\`solidity\n${code.slice(0, 12000)}\n\`\`\``;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Audit API error:", error);
    return res.status(500).json({
      error: "AI Contract Audit temporarily unavailable or failed to parse.",
      details: error?.message,
    });
  }
});

// Market Analysis AI Insights endpoint
app.post("/api/market-insights", async (req, res) => {
  try {
    const { token, price, change24h, volume, timeframe, language } = req.body;

    const ai = getGeminiClient();
    const isBn = language === "bn";

    const prompt = `You are an elite quantitative crypto analyst and technical trader.
Generate an institutional-grade technical analysis report for:
Token: ${token || "G-Coin / PlayBlock"}
Current Price: $${price || "1.25"}
24h Change: ${change24h || "+4.8%"}
24h Volume: $${volume || "12.4M"}
Timeframe: ${timeframe || "24H"}
Preferred Language: ${isBn ? "Bengali (বাংলা)" : "English"}

Return a JSON with:
{
  "trend": "BULLISH" | "BEARISH" | "NEUTRAL",
  "strengthScore": number (0 to 100),
  "supportLevels": ["string", "string"],
  "resistanceLevels": ["string", "string"],
  "technicalSignals": {
    "rsi": "string (e.g. 58.4 - Neutral/Bullish)",
    "macd": "string",
    "emaCrossing": "string",
    "volumeProfile": "string"
  },
  "keyCatalysts": ["string", "string", "string"],
  "tradingStrategy": "string",
  "riskWarning": "string"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Market Insights API error:", error);
    return res.status(500).json({
      error: "Market analysis generation error",
      details: error?.message,
    });
  }
});

// Vite Middleware integration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Web3 Server is running on port ${PORT}`);
  });
}

start();
