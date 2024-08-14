import { NextRequest, NextResponse } from "next/server";
import { ID, Permission, Role } from "node-appwrite";

import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { createSession } from "@/lib/session";
import { GrantRecord } from "@/type";

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
          code_verifier: "nylas",
        }),
      }
    );

    console.log("TOKEN RESPONSE", await tokenResponse.json());

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: "Failed to exchange code for token." },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log(tokenData);

    let grantRecord: GrantRecord | null = null;

    try {
      grantRecord = (await databases.getDocument(
        config.dbId,
        config.grantCollectionId,
        tokenData.email as string
      )) as GrantRecord;
    } catch (error) {
      try {
        grantRecord = (await databases.createDocument(
          config.dbId,
          config.grantCollectionId,
          tokenData.email,
          {
            grant_id: tokenData.grant_id,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            email: tokenData.email,
            scope: tokenData.scope,
            token_type: tokenData.token_type,
            id_token: tokenData.id_token,
          }
        )) as GrantRecord;
      } catch (error) {
        return NextResponse.json(
          { error: "An unexpected error occurred." },
          { status: 500 }
        );
      }
    }

    await createSession(grantRecord.grant_id);

    // Set up a session or redirect the user
    const res = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
    );

    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
