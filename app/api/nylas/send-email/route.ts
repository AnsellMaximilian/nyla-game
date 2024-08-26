import { BASE_XP_GAINED } from "@/const/leveling";
import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { decrypt } from "@/lib/session";
import { GrantRecord, PlayerNyla, SendEmailRequestBody } from "@/type";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await decrypt(cookies().get("session")?.value);
  const body = (await req.json()) as SendEmailRequestBody;

  if (!session?.grantRecordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const grantRecord = (await databases.getDocument(
      config.dbId,
      config.grantCollectionId,
      session.grantRecordId
    )) as GrantRecord;

    const res = await axios.post(
      `https://api.eu.nylas.com/v3/grants/${grantRecord.grant_id}/messages/send`,
      body,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${String(process.env.NYLAS_API_KEY)}`,
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }

  //   return NextResponse.json({success: false});
}
