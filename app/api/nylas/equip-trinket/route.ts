import { TRINKETS } from "@/const/trinkets";
import { config } from "@/lib/appwrite";
import { databases } from "@/lib/appwriteNode";
import { decrypt } from "@/lib/session";
import { GrantRecord, PlayerNyla } from "@/type";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await decrypt(cookies().get("session")?.value);
  const body = (await req.json()) as { trinketId: string; unequip: boolean };
  const foundTrinket = TRINKETS.find((t) => t.id === body.trinketId);

  if (!foundTrinket) {
    console.log("trinket not found");

    return NextResponse.json(
      { error: "Incorrect trinket id" },
      { status: 400 }
    );
  }

  if (!session?.grantRecordId) {
    console.log("mo session");

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

  if (!playerNyla.trinkets.some((t) => t === body.trinketId)) {
    console.log("not own");
    return NextResponse.json(
      { error: "You don't own this trinket" },
      { status: 401 }
    );
  }

  const updatedPlayerNyla = await databases.updateDocument(
    config.dbId,
    config.playerNylaCollectionId,
    playerNyla.$id,
    {
      equipped_trinket: body.unequip ? null : body.trinketId,
    }
  );

  return NextResponse.json({ ...updatedPlayerNyla, id: undefined });
}
