import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ProfileDetails from "../../../components/ProfileDetails";
import ProfilePublications from "../../../components/ProfilePublications";
import { getProfile, getPublications } from "../../../utils/lensQueries";
import ProfileLocks from "../../../components/ProfileLocks";
import { getLocksByUser } from "../../../utils/unlockQueries";
import Layout from "../../../components/layout/Layout";
import FollowUser from "../../../components/FollowUser";
import Loading from "../../../components/placeholders/Loading";
import Head from "next/head";
import ProfileTabs from "../../../components/ProfileTabs";

export default function ProfileLocksTabContent() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState();
  const [pubs, setPubs] = useState([]);
  const [locks, setLocks] = useState([]);

  const router = useRouter();
  const { lensHandle } = router.query;

  useEffect(() => {
    if (lensHandle) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [lensHandle]);

  async function fetchProfile() {
    try {
      let response = await getProfile({ handle: lensHandle });
      console.log("PROFILE:", response);
      setProfile(response.data.profile);

      let locksResponse = await getLocksByUser(response.data.profile.ownedBy);
      console.log("LOCKS MADE BY THIS PROFILE", locksResponse);
      if (locksResponse.data.locks) {
        setLocks(locksResponse.data.locks);
      }

      let pubResponse = await getPublications(response.data.profile.id);
      console.log("PUBS:", pubResponse.data.publications.items);
      setPubs(pubResponse.data.publications.items);
    } catch (error) {
      console.log("ERROR:", error);
    }
    setLoading(false);
  }

  return (
    <Layout>
      <Head>
        <title>{`${lensHandle} | Homebase`}</title>
      </Head>

      {loading ? (
        <Loading />
      ) : (
        <div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8 mb-8">
          {/* Side column */}
          <aside className="hidden col-span-3 xl:col-span-4 md:block">
            <div className="sticky top-4 space-y-4">
              {/* Profile info */}
              {profile && (
                <section aria-labelledby="about-heading">
                  <div className="rounded-lg bg-white shadow overflow-hidden pb-2">
                    <div className="relative h-24 w-full object-cover lg:h-32">
                      <Image
                        src="/assets/background.png"
                        alt="Default background"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="relative flex justify-between items-end px-6 -mt-12 sm:-mt-16">
                      {profile &&
                      profile.picture &&
                      profile.picture.original ? (
                        <img
                          className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32 border border-stone-50"
                          src={profile.picture.url}
                          alt={`${lensHandle} picture`}
                        />
                      ) : (
                        <Image
                          width="96"
                          height="96"
                          className="rounded-full"
                          src="/assets/avatar.png"
                          alt="Default avatar"
                        />
                      )}

                      <FollowUser profile={profile} />
                    </div>
                    <div className="relative px-6 py-4">
                      <h2
                        id="about-heading"
                        className="text-xl font-medium text-stone-900"
                      >
                        {profile.name ? profile.name : lensHandle}
                      </h2>
                      <h3 className="font-medium text-emerald-700 mt-1">
                        @{lensHandle}
                      </h3>
                      <p className="mt-4">
                        {profile.bio ? profile.bio : "Welcome to my homebase!"}
                      </p>
                      <div className="flex flex-wrap gap-x-2 text-stone-600 text-sm mt-4 justify-center md:justify-start">
                        <p>
                          <span className="text-stone-900 font-medium">
                            {profile.stats.totalFollowers}
                          </span>{" "}
                          Followers
                        </p>
                        <p>
                          <span className="text-stone-900 font-medium">
                            {profile.stats.totalFollowing}
                          </span>{" "}
                          Following
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </aside>

          {/* Main feed */}
          <main className="md:col-span-9 xl:col-span-6 space-y-4 px-4 lg:px-0">
            {/* Nav */}
            <ProfileTabs
              lensHandle={lensHandle}
              currentTabName={"Memberships"}
            />
            {/* Memberships */}
            <div>
              <h1 className="sr-only">Memberships</h1>
              {locks.length > 0 ? (
                <ProfilePublications pubs={pubs} />
              ) : (
                <div className="text-center rounded-lg border-2 border-dashed border-stone-300 p-12">
                  <h3 className="mt-2 text-sm font-medium text-stone-900">
                    No memberships yet
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {`Follow @${lensHandle} to stay tuned to upcoming memberships!`}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </Layout>
  );
}
