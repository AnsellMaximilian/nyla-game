import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("session in route", cookies().get("session"));
  return NextResponse.json({
    session: await decrypt(cookies().get("session")?.value),
  });
}
