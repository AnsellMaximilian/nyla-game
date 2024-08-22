"use client";

import Image from "next/image";
import React from "react";
import Container from "../Container";
import { ClientPlayerNyla } from "@/type";
import { calculateLevelFromXP, calculateXPForLevel } from "@/utils/leveling";

const NylaStat = ({ label, value }: { label: string; value: string }) => {
  return (
    <div>
      <div className="font-bold text-2xl">{label}</div>
      <div className="text-3xl">{value}</div>
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
        <div className="grow">
          <div className="space-y-4">
            <NylaStat label="Name" value="ansell@gmail.com" />
            <NylaStat
              label="Level"
              value={`${calculateLevelFromXP(nyla.xp)}`}
            />
            <NylaStat
              label="Exp to Next Level"
              value={`${nyla.xp}/${calculateXPForLevel(
                calculateLevelFromXP(nyla.xp) + 1
              )} xp`}
            />
            <NylaStat label="Name" value="ansell@gmail.com" />
          </div>
        </div>
      </div>
    </Container>
  );
}
