import Container from "@/components/Container";
import TrinketList from "@/components/trinkets/TrinketList";
import { TRINKETS } from "@/const/trinkets";
import Image from "next/image";
import React from "react";

export default function TrinketPage() {
  return (
    <div className="container mx-auto px-8">
      <TrinketList />
    </div>
  );
}
