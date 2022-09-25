import { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/router";

export default function Navbar() {
  const { address } = useAccount();
  const { auth } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const pathname = router.pathname;

  const activeClasses = "font-bold text-emerald-800 hover:text-emerald-700";
  const inactiveClasses = "font-medium text-stone-500 hover:text-emerald-700";

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
                <a className="text-xl text-emerald-800 font-cursive">
                  🏡 <span className="sr-only sm:not-sr-only">Homebase</span>
                </a>
              </Link>
            </div>
            <div className="ml-10 space-x-4 flex items-center">
              {address && auth && (
                <>
                  <Link href={`/dashboard/${auth.lens_handle}`}>
                    <a
                      className={
                        pathname.startsWith("/dashboard/")
                          ? activeClasses
                          : inactiveClasses
                      }
                    >
                      Dashboard
                    </a>
                  </Link>
                  <Link href={`/homebase/${auth.lens_handle}`}>
                    <a
                      className={
                        pathname.startsWith("/homebase/")
                          ? activeClasses
                          : inactiveClasses
                      }
                    >
                      Homebase
                    </a>
                  </Link>
                </>
              )}
              <ConnectButton />
            </div>
          </div>
        </nav>
      </header>
    )
  );
}
