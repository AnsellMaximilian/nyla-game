import Container from "@/components/Container";
import FriendItem from "@/components/FriendItem";
import HomeButton from "@/components/HomeButton";
import { Button } from "@/components/ui/button";
import { exampleFriends } from "@/const/examples";
import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { decrypt } from "@/lib/session";
import { Contact, GrantRecord, NylasResponse, PlayerNyla } from "@/type";
import axios from "axios";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: { page_token: string };
}) {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session?.grantRecordId) {
    redirect("/");
  }

  try {
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
          page_token: searchParams.page_token,
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
    return (
      <div className="container mx-auto p-8">
        <HomeButton className="mb-4" />
        <Container>
          <header className="flex justify-between mb-8">
            <h1 className="text-4xl font-bold ">Friends</h1>
          </header>
          <div className="mb-4 min-h-[300px]">
            {searchParams.page_token}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-lg">
              {exampleFriends.map((f) => (
                <FriendItem key={f.email} friend={f} />
              ))}
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <Link href={`/friends?page_token=test`}>Prev</Link>
            <Link href={`/friends?page_token=${friends.next_cursor}`}>
              Next
            </Link>
          </div>
        </Container>
      </div>
    );
  } catch (error) {
    console.log("WRONG TOKEN");
    redirect("/friends");
  }
}
