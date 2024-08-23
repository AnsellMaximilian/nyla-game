import React, { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="border-primary p-8 border-[20px] rounded-md bg-slate-200 text-white bg-[url('/images/texture-wall.png')] bg-[500px] vic-font max-w-full">
      {children}
    </div>
  );
}
