import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ControlsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:scale-105">Controls</button>
      </DialogTrigger>
      <DialogContent className="vic-font max-w-full w-[750px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-4xl">Game Controls</DialogTitle>
          <DialogDescription className="text-2xl">
            Preparing you for battles...
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 font-bold text-xl">
          <div className="flex justify-between items-center">
            <div className="text-3xl">Arrows</div>
            <div>Left, Right, Jump</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-3xl">C</div>
            <div>Attack</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-3xl">X</div>
            <div>Nyla Blast</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-3xl">Z</div>
            <div>Dash</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
