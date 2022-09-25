import Link from "next/link";
import { useState, useEffect } from "react";
import { getMaxKeys, getTotalSupply } from "../utils/unlockFunctions";
import { ethers } from "ethers";

export default function ProfileLock({ lock }) {
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
    <Link href={`/locks/${lock.address}`}>
      <div className="cursor-pointer p-4 rounded-lg bg-white shadow w-full border-2 border-transparent hover:border-emerald-600">
        <h5 className="font-bold text-stone-900">{lock.name}</h5>
        <p className="text-sm font-medium text-stone-500 mb-4">
          {ethers.utils.formatEther(lock.price)} MATIC
        </p>
        <div className="flex items-center text-stone-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
            />
          </svg>
          <span className="font-medium text-sm">
            {totalSupply ? totalSupply : 0} /{" "}
            {currentMaxKeys ? currentMaxKeys : "Infinite"}
          </span>
        </div>
      </div>
    </Link>
  );
}
