import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string." },
        { status: 400 }
      );
    }

    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in the environment variables.");
      return NextResponse.json(
        { error: "We couldn't generate this right now, please try again." },
        { status: 500 }
      );
    }

    // Sanitize API key (trim whitespace and remove potential wrapping quotes)
    apiKey = apiKey.trim().replace(/^["']|["']$/g, "");

    // Initialize GoogleGenerativeAI with the sanitized API key
    const genAI = new GoogleGenerativeAI(apiKey);

    let text = "";
    try {
      // Attempt using the pinned gemini-2.5-flash model first
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    } catch (primaryError: unknown) {
      const pErr = primaryError as { message?: string; status?: string | number };
      console.warn("Primary model (gemini-2.5-flash) failed. Attempting fallback model (gemini-1.5-flash)...", pErr?.message || pErr);

      // Fallback to gemini-1.5-flash
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await fallbackModel.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    }

    if (!text) {
      throw new Error("Empty response from Google Gemini API");
    }

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: string | number };
    const errorMessage = err?.message || "Unknown error";
    const errorStatus = err?.status || "No status code";
    console.error("Gemini API error:", errorMessage, errorStatus);
    return NextResponse.json(
      { error: "We couldn't generate this right now, please try again." },
      { status: 500 }
    );
  }
}
