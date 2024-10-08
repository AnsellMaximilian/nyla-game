import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { decrypt } from "@/lib/session";
import { Email, GrantRecord, NylasResponse } from "@/type";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";

// import Nylas from 'nylas'

export async function GET(req: NextRequest) {
  const session = await decrypt(cookies().get("session")?.value);
  const searchParams = req.nextUrl.searchParams;
  const unread = searchParams.get("unread") === "true";
  const limit = Number(searchParams.get("limit"));

  if (!session?.grantRecordId) {
    return NextResponse.json(
      {
        error: true,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const grant = (await databases.getDocument(
    config.dbId,
    config.grantCollectionId,
    session.grantRecordId
  )) as GrantRecord;

  const res = await axios.get(
    `https://api.eu.nylas.com/v3/grants/${grant.grant_id}/messages`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${String(process.env.NYLAS_API_KEY)}`,
        "Content-Type": "application/json",
      },
      params: {
        limit: limit ? limit : 1,
        unread: unread ? unread : undefined,
      },
    }
  );

  const latestEmails = res.data as NylasResponse<Email>;

  // const NylasConfig = {
  //  apiKey: String(process.env.NYLAS_API_KEY),
  //  apiUri: String(process.env.NYLAS_API_URI),
  // }

  // const nylas = new Nylas(NylasConfig)

  // const result = await nylas.messages.list({
  //   identifier: String(process.env.NYLAS_GRANT_ID),
  //   queryParams: {
  //     unread
  //     limit: 5
  //   }
  // })

  // return NextResponse.json(latestEmails.data[0]);
  return NextResponse.json(
    latestEmails.data.map((e) => ({ ...e, grant_id: undefined }))
  );
}
