import NylaMenu from "@/components/nyla/NylaMenu";
import TrinketList from "@/components/trinkets/TrinketList";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { decrypt } from "@/lib/session";
import { ClientPlayerNyla } from "@/type";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session?.grantRecordId) redirect("/");

  const nyla = await databases.getDocument(
    config.dbId,
    config.playerNylaCollectionId,
    session?.grantRecordId
  );

  return (
    <div className="container mx-auto p-8">
      <NylaMenu nyla={nyla} />
    </div>
  );
}
