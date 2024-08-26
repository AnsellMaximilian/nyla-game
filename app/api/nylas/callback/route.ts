import { NextRequest, NextResponse } from "next/server";
import { ID, Permission, Query, Role } from "node-appwrite";

import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { createSession } from "@/lib/session";
import { GrantRecord, PlayerNyla } from "@/type";

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
    console.log("CODE", code);
    const tokenResponse = await fetch(
      "https://api.eu.nylas.com/v3/connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          client_id: process.env.NEXT_PUBLIC_NYLAS_CLIENT_ID,
          client_secret: process.env.NYLAS_API_KEY,
          redirect_uri: "http://localhost:3000/api/nylas/callback",
          grant_type: "authorization_code",
          code_verifier: "nylas",
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
    console.log(tokenData);

    let grantRecord: GrantRecord | null = null;

    try {
      const res = await databases.listDocuments(
        config.dbId,
        config.grantCollectionId,
        [Query.equal("email", tokenData.email)]
      );

      if (res.total < 1) {
        throw new Error("No grant saved.");
      } else {
        grantRecord = res.documents[0] as GrantRecord;
      }
      console.log("FOUND CREATED");
    } catch (error) {
      try {
        grantRecord = (await databases.createDocument(
          config.dbId,
          config.grantCollectionId,
          ID.unique(),
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
        console.log("UPPER", error);
        if (error instanceof Error) console.log(error.message);
        return NextResponse.json(
          { error: "An unexpected error occurred." },
          { status: 500 }
        );
      }
    }

    // creating player Nyla
    let playerNyla: PlayerNyla | null = null;

    try {
      const res = await databases.listDocuments(
        config.dbId,
        config.playerNylaCollectionId,
        [Query.equal("email", tokenData.email)]
      );

      if (res.total < 1) {
        throw new Error("No player Nyla saved.");
      } else {
        playerNyla = res.documents[0] as PlayerNyla;
      }
      console.log("FOUND CREATED PLAYER NYLA");
    } catch (error) {
      try {
        playerNyla = (await databases.createDocument(
          config.dbId,
          config.playerNylaCollectionId,
          grantRecord.$id,
          {
            grant_id: tokenData.grant_id,
            email: tokenData.email,
          }
        )) as PlayerNyla;
      } catch (error) {
        console.log("UPPER", error);
        if (error instanceof Error) console.log(error.message);
        return NextResponse.json(
          { error: "An unexpected error occurred." },
          { status: 500 }
        );
      }
    }

    await createSession(grantRecord.$id);

    // Set up a session or redirect the user
    const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);

    return res;
  } catch (error) {
    console.log("BOTTOM", error);
    if (error instanceof Error) console.log(error.message);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
