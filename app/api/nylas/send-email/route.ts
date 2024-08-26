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

    if (grantRecord.invited_emails.includes(body.to[0].email)) {
      return NextResponse.json(
        { error: "Has already been invited by you" },
        { status: 401 }
      );
    }

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

    console.log(res.data);

    (await databases.updateDocument(
      config.dbId,
      config.grantCollectionId,
      session.grantRecordId,
      {
        invited_emails: [...grantRecord.invited_emails, body.to[0].email],
      }
    )) as GrantRecord;
    console.log("BOUT to invite u");
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    return NextResponse.json({ success: false });
  }

  //   return NextResponse.json({success: false});
}
