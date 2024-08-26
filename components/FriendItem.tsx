import { Friend } from "@/type";
import { calculateLevelFromXP } from "@/utils/leveling";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";

export default function FriendItem({
  friend,
  hasBeenInvited = false,
  invite,
}: {
  friend: Friend;
  hasBeenInvited?: boolean;
  invite: (email: string) => void;
}) {
  return (
    <div className="flex items-center">
      <Image
        src="/images/metal-nyla-v2.png"
        width={320}
        height={320}
        alt="metal nyla"
        className="w-20 z-10"
      />
      <div className="bg-gradient-to-b from-gray-400 via-gray-300 to-gray-400 text-black px-12 py-2 rounded-r-full pl-8 -ml-6 w-full relative">
        <div className="font-bold">{friend.email}</div>
        <div>
          {friend.nyla
            ? `Level ${calculateLevelFromXP(friend.nyla.xp)}`
            : "Friend doesn't play :("}
        </div>
        <Button
          onClick={() => invite(friend.email)}
          disabled={hasBeenInvited || friend.nyla !== null}
          size="icon"
          className="absolute top-1/2 -translate-y-1/2 rounded-full right-0"
        >
          <Mail />
        </Button>
      </div>
    </div>
  );
}
