"use client";

import { cn } from "@/lib/utils";
import { Trinket } from "@/type";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function SpinnerV2({
  trinkets,
  selectedTrinketId,
  onDone,
}: {
  trinkets: Trinket[];
  selectedTrinketId: string;
  onDone: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinalSelected, setIsFinalSelected] = useState(false);

  useEffect(() => {
    let shiftInterval: NodeJS.Timeout;
    let landingTimeout: NodeJS.Timeout;

    if (!isFinalSelected) {
      shiftInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % trinkets.length);
      }, 500);

      landingTimeout = setTimeout(() => {
        clearInterval(shiftInterval);
        const selectedIndex = trinkets.findIndex(
          (t) => t.id === selectedTrinketId
        );
        setCurrentIndex(selectedIndex);
        setIsFinalSelected(true);

        onDone();
      }, 10000);
    }

    return () => {
      clearInterval(shiftInterval);
      clearTimeout(landingTimeout);
    };
  }, [selectedTrinketId, trinkets, isFinalSelected]);

  const getVisibleTrinkets = () => {
    const visibleTrinkets = [];
    for (let i = -2; i <= 2; i++) {
      visibleTrinkets.push(
        trinkets[(currentIndex + i + trinkets.length) % trinkets.length]
      );
    }
    return visibleTrinkets;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80">
      <div className="flex w-full justify-center items-center">
        {getVisibleTrinkets().map((t, i) => (
          <div
            key={t.id}
            className={cn(
              " w-40 h-40 flex items-center justify-center bg-contain p-4 bg-no-repeat relative transition-all duration-150",
              i === 2
                ? "bg-[url('/images/trinkets/trinket-frame.png')] w-64 h-64 p-10"
                : ""
            )}
          >
            <div className="">
              <Image
                src={t.image}
                alt={t.name}
                width={320}
                height={320}
                className={cn(
                  "h-full w-full"
                  // selectedTrinket === t ? "" : "brightness-50"
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
