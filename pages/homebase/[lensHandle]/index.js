import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import { getProfile, getPublications } from "../../../utils/lensQueries";
import Layout from "../../../components/layout/Layout";
import Loading from "../../../components/placeholders/Loading";
import ProfilePublications from "../../../components/ProfilePublications";
import ProfileTabs from "../../../components/ProfileTabs";
import ProfileDetails from "../../../components/ProfileDetails";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState();
  const [pubs, setPubs] = useState([]);

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
        <title>
          {lensHandle ? `${lensHandle} | Homebase` : "Homebase of..."}
        </title>
      </Head>
      {loading ? (
        <Loading />
      ) : (
        <div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8 mb-8">
          {/* Side column */}
          <aside className="hidden col-span-3 xl:col-span-4 md:block">
            <div className="sticky top-4 space-y-4">
              {/* Profile info */}
              {profile && <ProfileDetails profile={profile} />}
            </div>
          </aside>

          {/* Main feed */}
          <main className="md:col-span-9 xl:col-span-6 space-y-4 px-4 lg:px-0">
            {/* Nav */}
            <ProfileTabs lensHandle={lensHandle} currentTabName={"Homebase"} />
            {/* Feed */}
            <div>
              <h1 className="sr-only">Feed</h1>
              {pubs.length > 0 ? (
                <ProfilePublications pubs={pubs} />
              ) : (
                <div className="text-center rounded-lg border-2 border-dashed border-stone-300 p-12">
                  <h3 className="mt-2 text-sm font-medium text-stone-900">
                    No posts yet
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {`Follow @${lensHandle} to stay tuned to future posts!`}
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
