import { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

export default function Navbar() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <header>
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Top"
        >
          <div className="w-full py-6 flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <a className="text-xl text-emerald-700 font-cursive">
                  🏡 <span className="sr-only sm:not-sr-only">Homebase</span>
                </a>
              </Link>
            </div>
            <div className="ml-10 space-x-4 flex items-center">
              <ConnectButton />
            </div>
          </div>
        </nav>
      </header>
    )
  );
}
