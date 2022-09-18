import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getFollowers } from "../../utils/lensQueries";
import { useRouter } from "next/router";
import Layout from "../../components/layout/Layout";

export default function Step4() {
  const router = useRouter();

  const { address } = useAccount();

  const [lensHandle, setLensHandle] = useState("");
  const [lensProfileId, setLensProfileId] = useState("0x02");
  const [followers, setFollowers] = useState([]);
  const [pageInfo, setPageInfo] = useState();

  async function fetchFollowers() {
    try {
      let response = await getFollowers(lensProfileId);
      console.log("fetchFollowers RESPONSE", response);
      setFollowers(response.data.followers.items);
      setPageInfo(response.data.followers.pageInfo);
    } catch (error) {
      console.log("fetchFollowers ERROR:", error);
    }
  }

  useEffect(() => {
    fetchFollowers();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Invite your homies</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto my-16 max-w-7xl px-4 sm:my-24 sm:px-6">
        <div className="mx-auto max-w-md sm:max-w-3xl">
          <h2 className="text-center text-3xl font-bold leading-8 tracking-tight text-stone-900 sm:text-4xl">
            Invite your homies
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-stone-500">
            Delight your Lens followers by sending them NFTs, or digital
            collectibles, that act as keys to your homebase.
          </p>
          <div className="mx-auto w-full sm:max-w-md mt-5 md:mt-8">
            <h6 className="font-medium text-stone-700">My Lens followers</h6>
            {followers.length > 0 && (
              <>
                <div className="space-y-4 mt-4 mb-8">
                  {followers.map((follower) => (
                    <div
                      key={follower.wallet.address}
                      className="relative flex items-center space-x-3 rounded-lg border border-stone-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-stone-400"
                    >
                      <div className="flex-shrink-0">
                        {follower.wallet.defaultProfile.picture &&
                        follower.wallet.defaultProfile.picture.original ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={
                              follower.wallet.defaultProfile.picture.original
                                .url
                            }
                            alt={follower.wallet.defaultProfile.handle}
                          />
                        ) : (
                          <div className="bg-emerald-900 w-10 h-10 rounded-full mx-auto" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <a href="#" className="focus:outline-none">
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          <p className="font-medium text-stone-900">
                            {follower.wallet.defaultProfile.handle}
                          </p>
                          <p className="text-sm text-stone-500">
                            {follower.wallet.defaultProfile.handle}
                          </p>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                {/* <nav
                  className="flex items-center justify-between border-y border-gray-200 bg-white px-2 py-3 mb-8"
                  aria-label="Pagination"
                >
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {pageInfo.prev.offset}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {pageInfo.next.offset}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">{pageInfo.totalCount}</span>{" "}
                      results
                    </p>
                  </div>
                  <div className="flex flex-1 justify-between sm:justify-end">
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </a>
                    <a
                      href="#"
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Next
                    </a>
                  </div>
                </nav> */}
              </>
            )}

            <div className="text-center">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Go to my homebase
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}