import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { question, schemeContext, userProfile } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your-gemini-api-key-here") {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a helpful government schemes assistant for Indian farmers using the Khetsetu app.
You speak in simple, friendly language that any farmer can understand. Avoid jargon.
Always answer in 2-4 short sentences. Be specific with numbers and rupee amounts.
If unsure, say so honestly.

CURRENT SCHEME CONTEXT:
- Name: ${schemeContext.name}
- Short Name: ${schemeContext.shortName}
- Description: ${schemeContext.description}
- Benefit: ${schemeContext.benefitLabel} (₹${schemeContext.benefitAmount}/year estimated)
- Eligibility: ${schemeContext.eligibility?.description || "All farmers"}
- Required Documents: ${schemeContext.requiredDocuments?.join(", ") || "Aadhaar, Bank Account"}
- Status: ${schemeContext.status}
- Deadline: ${schemeContext.deadline || "No fixed deadline (ongoing)"}
- Why it matters: ${schemeContext.whyItMatters}

USER PROFILE:
- State: ${userProfile.state}
- Crop: ${userProfile.cropType}
- Land Size: ${userProfile.landSizeAcres} acres

Answer the farmer's question specifically about this scheme and their situation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nFarmer's question: ${question}` }],
        },
      ],
    });

    const answer =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate an answer right now. Please try again.";

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Schemes AI error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
