import Link from "next/link";
import { useState, useEffect } from "react";
import { getMaxKeys, getTotalSupply } from "../utils/unlockFunctions";
import { ethers } from "ethers";

export default function LockCard({ lock }) {
  const [currentMaxKeys, setCurrentMaxKeys] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);

  useEffect(() => {
    if (lock.address) {
      async function fetchData() {
        await handleGetMaxKeysAndTotalSupply();
      }
      fetchData();
    }
  }, [lock]);

  async function handleGetMaxKeysAndTotalSupply() {
    let resp = await getMaxKeys(lock.address);
    if (resp) {
      setCurrentMaxKeys(resp);
    }
    resp = await getTotalSupply(lock.address);
    if (resp) {
      setTotalSupply(resp);
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-stone-900">{lock.name}</p>
        <p className="text-sm text-stone-500">
          <span className="block sm:inline">
            {ethers.utils.formatEther(lock.price)} MATIC
          </span>{" "}
          <span className="hidden sm:mx-1 sm:inline" aria-hidden="true">
            &middot;
          </span>{" "}
          <span className="block sm:inline">
            {totalSupply ? totalSupply : 0} /{" "}
            {currentMaxKeys ? currentMaxKeys : "Infinite"} Keys
          </span>
        </p>
      </div>
      <div>
        <Link href={`/locks/${lock.address}/manage`}>
          <a className="inline-flex items-center rounded-md border border-stone-500 px-2.5 py-0.5 text-sm font-medium leading-5 text-stone-700 shadow-sm hover:bg-stone-50">
            Manage
          </a>
        </Link>
      </div>
    </div>
  );
}
