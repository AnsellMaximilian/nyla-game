import Container from "@/components/Container";
import FriendItem from "@/components/FriendItem";
import FriendsList from "@/components/FriendsList";
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

export default async function Page() {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session?.grantRecordId) {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-8">
      <HomeButton className="mb-4" />
      <FriendsList />
    </div>
  );
}
