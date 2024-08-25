import { BASE_XP_GAINED } from "@/const/leveling";
import { TRINKETS } from "@/const/trinkets";
import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { decrypt } from "@/lib/session";
import { GrantRecord, PlayerNyla } from "@/type";
import { hasBeenADaySince } from "@/utils/common";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await decrypt(cookies().get("session")?.value);

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

  if (
    playerNyla.last_trinket_spin != null &&
    !hasBeenADaySince(playerNyla.last_trinket_spin)
  ) {
    return NextResponse.json(
      { error: "Not able to spin yet. Wait a day after last spin." },
      { status: 401 }
    );
  }

  // get random trinket
  const randomIndex = Math.floor(Math.random() * TRINKETS.length);
  const receivedTrinket = TRINKETS[randomIndex];

  const updatedTrinkets = [...playerNyla.trinkets];

  if (!updatedTrinkets.includes(receivedTrinket.id)) {
    updatedTrinkets.push(receivedTrinket.id);
  }

  const updatedPlayerNyla = await databases.updateDocument(
    config.dbId,
    config.playerNylaCollectionId,
    playerNyla.$id,
    {
      trinkets: updatedTrinkets,
      last_trinket_spin: new Date().toISOString(),
    }
  );

  return NextResponse.json({
    updatedPlayerNyla: { ...updatedPlayerNyla, id: undefined },
    receivedTrinket,
  });
}
