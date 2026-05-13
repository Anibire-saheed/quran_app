import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    // 1. Prioritize content-specific credentials (dual-token architecture)
    const clientId = process.env.QF_CONTENT_CLIENT_ID || process.env.NEXT_PUBLIC_QF_CLIENT_ID || "";
    const clientSecret = process.env.QF_CONTENT_CLIENT_SECRET || process.env.QF_CLIENT_SECRET || "";

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Missing client credentials" }, { status: 500 });
    }

    // 2. Determine OAuth Base URL
    // If we are using the production content ID (aeca4a72...), we MUST hit the production OAuth server.
    // Otherwise, we default to the env-specified base or production as final fallback.
    const PRODUCTION_CONTENT_ID = "aeca4a72-11c4-44de-a1b1-06414faa9343";
    let oauthBase = process.env.NEXT_PUBLIC_QF_OAUTH_BASE_URL || "https://oauth2.quran.foundation";
    
    if (clientId === PRODUCTION_CONTENT_ID) {
      oauthBase = "https://oauth2.quran.foundation";
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await axios.post(
      `${oauthBase}/oauth2/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        scope: "content",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${auth}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Content token error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to fetch content token", details: error.response?.data },
      { status: error.response?.status || 500 }
    );
  }
}
