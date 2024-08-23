"use client";

import Image from "next/image";
import React from "react";
import Container from "../Container";
import { ClientPlayerNyla } from "@/type";
import { calculateLevelFromXP, calculateXPForLevel } from "@/utils/leveling";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { baseUpgradeStats } from "@/const/player";

const NylaStat = ({
  stat,
  base,
  addition,
}: {
  stat: string;
  base: number;
  addition: number;
  onAdd: () => void;
  onSubtract: () => void;
}) => {
  return (
    <div className="flex justify-between text-2xl">
      <div>{stat}</div>
      <div className="flex gap-2 items-center">
        <div className="font-bold">{base}</div>
        <div className="gap-2 flex items-center text-lg">
          <Button className="p-2">
            <Plus size={16} />
          </Button>
          <div>+{addition}</div>
          <Button className="p-2">
            <Minus size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function NylaProfile({ nyla }: { nyla: ClientPlayerNyla }) {
  return (
    <Container>
      <div className="flex gap-8">
        <div className="border-[12px] rounded-md overflow-hidden border-primary">
          <Image
            src="/images/nyla-profile.png"
            alt="Nyla Profile"
            width={320}
            height={640}
          />
        </div>
        <div className="grow flex flex-col">
          <header className="text-center">
            <h1 className="text-4xl font-bold">{nyla.email}</h1>
            <div className="text-3xl">
              Level {calculateLevelFromXP(nyla.xp)}
            </div>
          </header>
          <Separator className="text-white bg-white h-1 my-4" />
          <div className="flex flex-col grow">
            <h2 className="text-2xl font-bold">Upgrades</h2>
            <div className="mt-4 space-y-2">
              <NylaStat
                onAdd={() => {}}
                onSubtract={() => {}}
                stat="Attack"
                base={baseUpgradeStats.ATTACK}
                addition={200}
              />

              <NylaStat
                onAdd={() => {}}
                onSubtract={() => {}}
                stat="Health"
                base={baseUpgradeStats.ATTACK}
                addition={200}
              />

              <NylaStat
                onAdd={() => {}}
                onSubtract={() => {}}
                stat="Speed"
                base={baseUpgradeStats.ATTACK}
                addition={200}
              />
            </div>
            <div className="mt-auto text-right">
              <Button className="text-xl">Confirm Upgrade</Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
