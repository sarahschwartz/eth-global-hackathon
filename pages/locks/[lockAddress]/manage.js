import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { getLockFromAddress } from "../../../utils/unlockQueries";
import { getMaxKeys, getTotalSupply } from "../../../utils/unlockFunctions";
import Layout from "../../../components/layout/Layout";
import Loading from "../../../components/placeholders/Loading";
import GrantKeysForm from "../../../components/GrantKeysForm";
import UpdateLock from "../../../components/UpdateLock";

export default function ManageLockPage() {
  const [loading, setLoading] = useState(true);
  const [lock, setLock] = useState();
  const [ownsLock, setOwnsLock] = useState(false);
  const [currentMaxKeys, setCurrentMaxKeys] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);

  const router = useRouter();
  const { lockAddress } = router.query;
  const { address } = useAccount();

  useEffect(() => {
    if (lockAddress) {
      async function fetchData() {
        await fetchLock();
      }

      fetchData();
    }
  }, [lockAddress, address]);

  async function fetchLock() {
    try {
      let response = await getLockFromAddress(lockAddress);
      setLock(response.data.lock);

      if (
        address &&
        response.data.lock &&
        address.toLowerCase() === response.data.lock.owner.toLowerCase()
      ) {
        setOwnsLock(true);
        await handleGetMaxKeysAndTotalSupply();
      }

      setLoading(false);
    } catch (error) {
      console.log("ERROR:", error);
      setLoading(false);
    }
  }

  async function handleGetMaxKeysAndTotalSupply() {
    let resp = await getMaxKeys(lockAddress);
    if (resp) {
      setCurrentMaxKeys(resp);
    }
    resp = await getTotalSupply(lockAddress);
    if (resp) {
      setTotalSupply(resp);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {loading ? (
          <Loading />
        ) : (
          <>
            {ownsLock ? (
              <div className="mx-auto max-w-md sm:max-w-3xl mb-8 sm:mb-12">
                <h1 className="text-3xl leading-8 text-emerald-900 sm:text-4xl font-cursive font-normal">
                  Manage my lock
                </h1>
                <p className="text-xl text-stone-600 mx-auto mt-4 mb-5">
                  Manage memberships for your homebase.
                </p>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-medium text-stone-900">
                      {lock.name}
                    </h2>
                    <p className="text-sm sm:text-base text-stone-500">
                      <span className="block sm:inline">
                        {ethers.utils.formatEther(lock.price)} MATIC
                      </span>{" "}
                      <span
                        className="hidden sm:mx-1 sm:inline"
                        aria-hidden="true"
                      >
                        &middot;
                      </span>{" "}
                      <span className="block sm:inline">
                        {totalSupply ? totalSupply : 0} Total Supply
                      </span>
                      <span
                        className="hidden sm:mx-1 sm:inline"
                        aria-hidden="true"
                      >
                        &middot;
                      </span>{" "}
                      <span className="block sm:inline">
                        {currentMaxKeys ? currentMaxKeys : "Infinite"} Max Keys
                      </span>
                    </p>
                  </div>
                </div>
                <GrantKeysForm lockAddress={lock.address} />
                <UpdateLock lockAddress={lock.address} />
              </div>
            ) : (
              <div className="mx-auto max-w-md sm:max-w-3xl my-8 sm:my-12">
                <h1 className="text-center text-3xl leading-8 text-emerald-900 sm:text-4xl font-cursive font-normal">
                  Uh oh...
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-stone-600">
                  You do not have permission to manage this lock.
                </p>
                <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center rounded-md border border-transparent bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Go back
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
