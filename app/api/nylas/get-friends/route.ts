import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { decrypt } from "@/lib/session";
import {
  Contact,
  Email,
  Friend,
  GrantRecord,
  NylasResponse,
  PlayerNyla,
} from "@/type";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";
import sanitizeHtml from "sanitize-html";

// import Nylas from 'nylas'

export async function GET(req: NextRequest) {
  const session = await decrypt(cookies().get("session")?.value);
  const searchParams = req.nextUrl.searchParams;
  const page_token = searchParams.get("page_token");

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

  const resFriends = await axios.get(
    `https://api.eu.nylas.com/v3/grants/${grant.grant_id}/contacts`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${String(process.env.NYLAS_API_KEY)}`,
        "Content-Type": "application/json",
      },
      params: {
        limit: 1,
        page_token: page_token ? page_token : undefined,
      },
    }
  );

  const contacts = resFriends.data as NylasResponse<Contact>;

  const playerNylasRes = await databases.listDocuments(
    config.dbId,
    config.playerNylaCollectionId,
    [
      Query.limit(100),
      Query.equal(
        "email",
        contacts.data.map((c) => c.emails.map((e) => e.email)).flat()
      ),
    ]
  );

  const playerNylas = playerNylasRes.documents as PlayerNyla[];

  return NextResponse.json({
    ...contacts,
    data: contacts.data.map((c) => {
      const foundNyla = playerNylas.find((pn) =>
        c.emails.some((e) => e.email === pn.email)
      );
      const friend: Friend = {
        email: c.emails[0] ? c.emails[0].email : "No email",
        nyla: foundNyla ? foundNyla : null,
      };

      return friend;
    }),
  });
}
