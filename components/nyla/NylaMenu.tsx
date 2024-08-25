"use client";
import React, { useState } from "react";
import TrinketList from "../trinkets/TrinketList";
import { Button } from "@/components/ui/button";
import { NylaMenu as INylaMenu } from "@/const/player";
import NylaProfile from "./NylaProfile";
import { ClientPlayerNyla, PlayerNyla } from "@/type";
import Spinner from "../trinkets/Spinner";
import { TRINKETS } from "@/const/trinkets";

const MENU = [INylaMenu.NYLA, INylaMenu.TRINKETS];

export default function NylaMenu({ nyla }: { nyla: ClientPlayerNyla }) {
  const [selectedMenu, setSelectedMenu] = useState<INylaMenu>(INylaMenu.NYLA);
  return (
    <div className="">
      <div className="flex justify-center gap-4 mb-4">
        {MENU.map((m) => (
          <Button
            key={m}
            onClick={() => setSelectedMenu(m)}
            className="text-2xl px-8 py-6 w-[150px]"
            variant={selectedMenu === m ? "default" : "secondary"}
          >
            {m}
          </Button>
        ))}
      </div>
      <div>
        {selectedMenu === INylaMenu.NYLA ? (
          <NylaProfile nyla={nyla} />
        ) : (
          <TrinketList nyla={nyla as PlayerNyla} />
          // <Spinner trinkets={TRINKETS} selectedTrinketId="SUNBEAM_SCEPTER" />
        )}
      </div>
    </div>
  );
}
