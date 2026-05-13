import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_QF_CLIENT_ID || "";
    const clientSecret = process.env.QF_CLIENT_SECRET || "";
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_QF_OAUTH_BASE_URL}/oauth2/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NEXT_PUBLIC_QF_OAUTH_REDIRECT_URI || "http://localhost:3000/callback",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${auth}`,
        },
      }
    );

    const data = response.data;
    
    const nextResponse = NextResponse.json(data);
    
    // Set secure cookie for middleware protection
    if (data.access_token) {
      nextResponse.cookies.set("qf_session", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: data.expires_in || 3600,
        path: "/",
      });
    }

    return nextResponse;
  } catch (error: any) {
    console.error("Token exchange error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Token exchange failed", details: error.response?.data },
      { status: error.response?.status || 500 }
    );
  }
}
