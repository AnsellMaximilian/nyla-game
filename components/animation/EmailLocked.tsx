"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function EmailLocked({ onDone }: { onDone: () => void }) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setCurrentFrame((prev) => (prev === 3 ? 3 : prev + 1));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (currentFrame === 3) {
      timeout = setTimeout(() => {
        onDone();
      }, 1000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [currentFrame]);
  return (
    <div className="fixed z-10 bg-black inset-0 flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold vic-font text-white mb-8">
        Not So Fast...
      </h1>
      <Image
        src="/images/email-chained-0.png"
        className={cn(currentFrame === 0 ? "block" : "hidden")}
        width={320}
        height={320}
        alt="email chained"
      />

      <Image
        src="/images/email-chained-1.png"
        className={cn(currentFrame === 1 ? "block" : "hidden")}
        width={320}
        height={320}
        alt="email chained"
      />

      <Image
        src="/images/email-chained-2.png"
        className={cn(currentFrame === 2 ? "block" : "hidden")}
        width={320}
        height={320}
        alt="email chained"
      />

      <Image
        src="/images/email-chained-3.png"
        className={cn(currentFrame === 3 ? "block" : "hidden")}
        width={320}
        height={320}
        alt="email chained"
      />
    </div>
  );
}
