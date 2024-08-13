import { NextRequest, NextResponse } from "next/server";
import { ID, Permission, Role } from "node-appwrite";

import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization failed or was canceled." },
      { status: 400 }
    );
  }

  try {
    const tokenResponse = await fetch(
      "https://api.us.nylas.com/v3/connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          client_id: process.env.NEXT_PUBLIC_NYLAS_CLIENT_ID,
          client_secret: process.env.NYLAS_API_KEY,
          redirect_uri: "http://localhost:3000/game",
          grant_type: "authorization_code",
        }),
      }
    );

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: "Failed to exchange code for token." },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();

    const response = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID || "", // Your database ID
      process.env.APPWRITE_COLLECTION_ID || "", // Your collection ID
      "unique()", // Generate a unique ID for the document
      {
        grant_id: tokenData.grant_id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        email: tokenData.email,
        scope: tokenData.scope,
        token_type: tokenData.token_type,
        id_token: tokenData.id_token,
      }
    );

    // Set up a session or redirect the user
    const res = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
    );
    res.cookies.set("sessionId", response.$id, {
      httpOnly: true,
      secure: true,
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
