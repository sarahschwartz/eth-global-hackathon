import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getLocksByUser } from "../../utils/unlockQueries";
import DashboardLocks from "../../components/dashboard/DashboardLocks";
import Layout from "../../components/layout/Layout";
import Loading from "../../components/placeholders/Loading";
import NeedConnectWallet from "../../components/placeholders/NeedConnectWallet";
import Head from "next/head";

export default function ManageLocks() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [locks, setLocks] = useState([]);

  const { address } = useAccount();

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
    if (address) {
      fetchLocks();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchLocks() {
    try {
      let locksResponse = await getLocksByUser(address);
      if (locksResponse.data.locks) {
        setLocks(locksResponse.data.locks);
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
    setLoading(false);
  }

  return (
    <Layout>
      <Head>
        <title>Manage locks | Homebase</title>
      </Head>
      {mounted && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {loading ? (
            <Loading />
          ) : (
            <>
              {address ? (
                <div className="mx-auto max-w-md sm:max-w-3xl mb-8 sm:mb-12">
                  <h1 className="text-center text-3xl leading-8 text-emerald-800 sm:text-4xl font-cursive font-normal">
                    Manage my locks
                  </h1>
                  <p className="text-center text-xl text-stone-600 mx-auto mt-4 mb-8">
                    View and manage all memberships for your homebase.
                  </p>
                  <DashboardLocks locks={locks} />
                </div>
              ) : (
                <NeedConnectWallet message="Connect your wallet to manage your locks." />
              )}
            </>
          )}
        </div>
      )}
    </Layout>
  );
}
