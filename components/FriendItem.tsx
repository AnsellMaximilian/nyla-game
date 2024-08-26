import { Friend } from "@/type";
import { calculateLevelFromXP } from "@/utils/leveling";
import Image from "next/image";
import React from "react";

export default function FriendItem({ friend }: { friend: Friend }) {
  return (
    <div className="flex items-center">
      <Image
        src="/images/metal-nyla-v2.png"
        width={320}
        height={320}
        alt="metal nyla"
        className="w-20 z-10"
      />
      <div className="bg-gradient-to-b from-gray-400 via-gray-300 to-gray-400 text-black px-12 py-2 rounded-r-lg pl-8 -ml-6 w-full">
        <div className="font-bold">{friend.email}</div>
        <div>
          {friend.nyla
            ? `Level ${calculateLevelFromXP(friend.nyla.xp)}`
            : "Friend doesn't play :("}
        </div>
      </div>
    </div>
  );
}
