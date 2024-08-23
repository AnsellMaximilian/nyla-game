import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { decrypt } from "@/lib/session";
import { Contact, GrantRecord, NylasResponse, PlayerNyla } from "@/type";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session?.grantRecordId) {
    redirect("/");
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
        page_token: "GgYKAggBEAI",
      },
    }
  );

  const friends = resFriends.data as NylasResponse<Contact>;
  //   const playerNylas = await databases.

  const friendNylas: {
    friend: Contact;
    nyla: PlayerNyla;
  }[] = [];

  console.log(friends);
  return <div>Page</div>;
}
