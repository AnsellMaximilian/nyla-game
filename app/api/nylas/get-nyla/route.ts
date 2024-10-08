import { BASE_XP_GAINED } from "@/const/leveling";
import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { decrypt } from "@/lib/session";
import { GrantRecord, PlayerNyla } from "@/type";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session?.grantRecordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const playerNyla = (await databases.getDocument(
    config.dbId,
    config.playerNylaCollectionId,
    session.grantRecordId
  )) as PlayerNyla;

  return NextResponse.json({ ...playerNyla, id: undefined });
}
