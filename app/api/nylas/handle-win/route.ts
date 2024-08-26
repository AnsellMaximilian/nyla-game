import { BASE_XP_GAINED } from "@/const/leveling";
import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { decrypt } from "@/lib/session";
import { BossParams, GrantRecord, PlayerNyla } from "@/type";
import { getXpBoost } from "@/utils/boss";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await decrypt(cookies().get("session")?.value);

  const body = (await req.json()) as { bossParams: BossParams };
  let gainedXP;
  if (body.bossParams) {
    gainedXP = BASE_XP_GAINED * getXpBoost(body.bossParams);
  } else {
    gainedXP = BASE_XP_GAINED;
  }

  if (!session?.grantRecordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const grantRecord = (await databases.getDocument(
    config.dbId,
    config.grantCollectionId,
    session.grantRecordId
  )) as GrantRecord;
  const playerNyla = (await databases.getDocument(
    config.dbId,
    config.playerNylaCollectionId,
    grantRecord.$id
  )) as PlayerNyla;

  const updatedPlayerNyla = await databases.updateDocument(
    config.dbId,
    config.playerNylaCollectionId,
    playerNyla.$id,
    {
      xp: playerNyla.xp + gainedXP,
    }
  );

  return NextResponse.json({ ...updatedPlayerNyla, id: undefined });
}
