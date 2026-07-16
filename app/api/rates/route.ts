import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch rates from open.er-api.com
    // This is free, reliable, and does not require an API key.
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 300 } // Cache at Next.js level for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from open.er-api: status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in currency converter API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch currency exchange rates. Please try again." },
      { status: 500 }
    );
  }
}
