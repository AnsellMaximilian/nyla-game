"use client";
import { cn } from "@/lib/utils";
import { Trinket } from "@/type";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Spinner({
  trinkets,
  selectedTrinketId,
  onDone,
}: {
  trinkets: Trinket[];
  selectedTrinketId: string;
  onDone: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);

  useEffect(() => {
    if (isSpinning) {
      let endTimeout: NodeJS.Timeout;
      let interval = setInterval(() => {
        // console.log("SPIN outside");

        setIndex((prevIndex) => {
          const idx = (prevIndex + 1) % trinkets.length;

          return idx;
        });
      }, 400);

      setTimeout(() => {
        clearInterval(interval);
        interval = setInterval(() => {
          //   console.log("SPIN internal");
          setIndex((prevIndex) => {
            const idx = (prevIndex + 1) % trinkets.length;
            if (trinkets[idx].id === selectedTrinketId) {
              clearInterval(interval);
              setIsSpinning(false);
              //   console.log("FOUND", trinkets[idx].id);
              endTimeout = setTimeout(() => {
                onDone();
              }, 5000);
            }
            return idx;
          });
        }, 400);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(endTimeout);
      };
    }
  }, [isSpinning, trinkets, selectedTrinketId, onDone]);

  const displayedTrinkets = [
    trinkets[(index + trinkets.length - 2) % trinkets.length],
    trinkets[(index + trinkets.length - 1) % trinkets.length],
    trinkets[index],
    trinkets[(index + 1) % trinkets.length],
    trinkets[(index + 2) % trinkets.length],
  ];

  //   const receivedTrinket = trinkets.find((t) => t.id === selectedTrinketId)!;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80">
      <div className="flex gap-8 items-end justify-center">
        {displayedTrinkets.map((t, i) => (
          <div
            key={t.id}
            className={cn(
              " w-40 h-40 flex items-center justify-center bg-contain p-4 bg-no-repeat relative",
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
