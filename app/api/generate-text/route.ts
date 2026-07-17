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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in the environment variables.");
      return NextResponse.json(
        { error: "We couldn't generate this right now, please try again." },
        { status: 500 }
      );
    }

    // Initialize GoogleGenerativeAI with your API key
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from Google Gemini API");
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error in generate-text route:", error);
    return NextResponse.json(
      { error: "We couldn't generate this right now, please try again." },
      { status: 500 }
    );
  }
}
