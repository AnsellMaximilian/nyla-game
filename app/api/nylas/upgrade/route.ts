import { BASE_XP_GAINED } from "@/const/leveling";
import { BaseUpgradeProperty, baseUpgradeStats } from "@/const/player";
import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { decrypt } from "@/lib/session";
import { GrantRecord, PlayerNyla } from "@/type";
import { calculateLevelFromXP } from "@/utils/leveling";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await decrypt(cookies().get("session")?.value);

  const body = (await req.json()) as { upgrades: BaseUpgradeProperty[] };

  if (!body.upgrades.every((up) => up in baseUpgradeStats)) {
    return NextResponse.json(
      { error: "Incorrect upgrade value" },
      { status: 400 }
    );
  }

  console.log(body);

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
  const availablePoints =
    calculateLevelFromXP(playerNyla.xp) - playerNyla.upgrades.length;

  if (availablePoints < body.upgrades.length) {
    return NextResponse.json(
      { error: "Incorrect number of upgrades" },
      { status: 400 }
    );
  }

  // upgrade

  const updatedPlayerNyla = await databases.updateDocument(
    config.dbId,
    config.playerNylaCollectionId,
    playerNyla.$id,
    {
      upgrades: [...playerNyla.upgrades, ...body.upgrades],
    }
  );

  return NextResponse.json({ ...updatedPlayerNyla, id: undefined });
}
