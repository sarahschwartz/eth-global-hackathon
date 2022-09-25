import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getLockFromAddress } from "../../../utils/unlockQueries";
import Layout from "../../../components/layout/Layout";
import Loading from "../../../components/placeholders/Loading";
import GrantKeysForm from "../../../components/GrantKeysForm";
import UpdateLock from "../../../components/UpdateLock";
import LockDetails from "../../../components/LockDetails";
import Head from "next/head";

export default function ManageLockPage() {
  const [loading, setLoading] = useState(true);
  const [lock, setLock] = useState();
  const [ownsLock, setOwnsLock] = useState(false);

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
      }

      setLoading(false);
    } catch (error) {
      console.log("ERROR:", error);
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Manage lock | Homebase</title>
      </Head>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {loading ? (
          <Loading />
        ) : (
          <>
            {ownsLock ? (
              <div className="mx-auto max-w-md sm:max-w-3xl mb-8 sm:mb-12">
                <h1 className="text-center text-3xl leading-8 text-emerald-800 sm:text-4xl font-cursive font-normal">
                  Manage my lock
                </h1>
                <p className="text-center text-xl text-stone-600 mx-auto mt-4 mb-8">
                  View and manage this membership for your homebase.
                </p>
                <LockDetails lock={lock} />
                <GrantKeysForm lockAddress={lock.address} />
                <UpdateLock lockAddress={lock.address} />
              </div>
            ) : (
              <div className="mx-auto max-w-md sm:max-w-3xl my-8 sm:my-12">
                <h1 className="text-center text-3xl leading-8 text-emerald-800 sm:text-4xl font-cursive font-normal">
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
