import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  getLockFromAddress,
  checkIfKeyOwner,
} from "../../../utils/unlockQueries";
import PurchaseKey from "../../../components/PurchaseKey";
import LockDetails from "../../../components/LockDetails";
import Layout from "../../../components/layout/Layout";
import Loading from "../../../components/placeholders/Loading";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ViewLockPage() {
  const [loading, setLoading] = useState(true);
  const [lock, setLock] = useState();
  const [ownsKey, setOwnsKey] = useState(false);

  const router = useRouter();
  const { lockAddress } = router.query;
  const { address } = useAccount();

  useEffect(() => {
    if (lockAddress) {
      async function fetchData() {
        await fetchLock();
        if (address) {
          await handleCheckIfKeyOwner();
        }
        setLoading(false);
      }
      fetchData();
    }
  }, [lockAddress, address]);

  async function fetchLock() {
    try {
      let response = await getLockFromAddress(lockAddress);
      setLock(response.data.lock);
    } catch (error) {
      console.log("ERROR:", error);
    }
  }

  async function handleCheckIfKeyOwner() {
    let resp = await checkIfKeyOwner(lockAddress, address);
    console.log("my address", address);
    console.log("checkIfKeyOwner", resp);
    if (resp.data.keys.length > 0) {
      if (resp.data.keys[0].lock.id === lockAddress) {
        setOwnsKey(true);
      }
    }
  }

  return (
    <Layout>
      <Head>
        <title>View lock | Homebase</title>
      </Head>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {loading ? (
          <Loading />
        ) : (
          <>
            {ownsKey ? (
              <div className="mx-auto max-w-md sm:max-w-3xl my-8 sm:my-12">
                <h1 className="text-center text-3xl leading-8 text-emerald-800 sm:text-4xl font-cursive font-normal">
                  View lock
                </h1>
                <p className="text-center text-xl text-stone-600 mx-auto mt-4 mb-8">
                  You own a key to this lock.
                </p>
                <div className="flex flex-wrap items-center justify-between space-x-4 rounded-lg border border-stone-300 p-4">
                  <LockDetails lock={lock} />
                  <span className="inline-flex items-center rounded-full border border-emerald-700 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                    Key owned
                  </span>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-md sm:max-w-3xl my-2 sm:my-4">
                <div className="text-center mb-4">
                  <Image
                    width="80"
                    height="80"
                    src="/assets/key.png"
                    alt="Key"
                  />
                </div>
                <h1 className="text-center text-3xl leading-8 text-emerald-800 sm:text-4xl font-cursive font-normal">
                  Get access
                </h1>
                <p className="text-center text-xl text-stone-600 mx-auto mt-4 mb-8">
                  Purchase a key to this lock to get access to private content.
                </p>
                <div className="flex flex-wrap items-center justify-between space-x-4 rounded-lg border border-stone-300 p-4">
                  <LockDetails lock={lock} />
                  {address ? <PurchaseKey lock={lock} /> : <ConnectButton />}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
