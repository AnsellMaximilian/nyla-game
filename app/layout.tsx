import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nyla the Cat",
  description: "Nyla Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "min-h-screen flex flex-col max-w-full bg-blue-950 bg-[url('/images/home-bg-v2.png')] bg-[center_bottom] bg-no-repeat bg-cover"
        )}
      >
        {children}

        <Toaster />
      </body>
    </html>
  );
}
