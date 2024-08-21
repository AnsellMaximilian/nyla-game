"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import { TRINKETS } from "@/const/trinkets";
import Image from "next/image";
import { Trinket } from "@/type";
import { cn } from "@/lib/utils";

export default function TrinketList() {
  const [selectedTrinket, setSelectedTrinket] = useState<Trinket>(TRINKETS[0]);
  return (
    <Container>
      <h1 className="text-4xl font-bold">Trinkets</h1>
      <div className="flex gap-4 flex-wrap">
        {TRINKETS.map((t) => {
          return (
            <div
              key={t.id}
              className={cn(
                "cursor-pointer w-44 h-44 bg-[url('/images/trinkets/trinket-frame.png')] flex items-center justify-center bg-contain p-8 bg-no-repeat relative"
              )}
              onClick={() => setSelectedTrinket(t)}
            >
              {!(selectedTrinket === t) && (
                <div className="absolute inset-0 bg-black/50"></div>
              )}
              <div className="">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={320}
                  height={320}
                  className="h-full w-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
