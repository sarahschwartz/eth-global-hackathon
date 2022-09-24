import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import {
  getProfile,
  getProfiles,
  getPublications,
} from "../../utils/lensQueries";
import { useAccount } from "wagmi";
import { getLocksByUser } from "../../utils/unlockQueries";
import DashboardLocks from "../../components/dashboard/DashboardLocks";
import DashboardPosts from "../../components/dashboard/DashboardPosts";
import CreateLock from "../../components/CreateLock";
import Layout from "../../components/layout/Layout";
import CreateLensPost from "../../components/CreateLensPost";
import Loading from "../../components/placeholders/Loading";
import RedirectDashboard from "../../components/placeholders/RedirectDashboard";
import NeedProfile from "../../components/placeholders/NeedProfile";
import NeedConnectWallet from "../../components/placeholders/NeedConnectWallet";

function WrongDashboard({ address }) {
  const [alreadyHasHandle, setAlreadyHasHandle] = useState();
  const [handle, setHandle] = useState();

  useEffect(() => {
    async function checkAddress() {
      console.log("ADDRESS", address);

      let resp = await getProfiles({ ownedBy: address });
      console.log("DEFAULT RESP", resp);

      if (resp.data.profiles.items.length > 0) {
        setAlreadyHasHandle(true);
        setHandle(resp.data.profiles.items[0].handle);
      } else {
        setAlreadyHasHandle(false);
      }
    }

    checkAddress();
  }, [address]);
  if (alreadyHasHandle && handle) {
    return <RedirectDashboard handle={handle} />;
  }
  if (alreadyHasHandle === false) {
    return <NeedProfile />;
  }
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState();
  const [mounted, setMounted] = useState(false);
  const [locks, setLocks] = useState([]);
  const [isUser, setIsUser] = useState(false);
  const [showCreateLock, setShowCreateLock] = useState(false);
  const [pubs, setPubs] = useState([]);

  const router = useRouter();
  const { lensHandle } = router.query;
  const { address } = useAccount();

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
    if (lensHandle) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [lensHandle, address]);

  async function fetchProfile() {
    try {
      let response = await getProfile({ handle: lensHandle });
      console.log("fetchProfile", response.data.profile);

      if (response.data.profile) {
        setProfile(response.data.profile);

        if (response.data.profile.ownedBy === address) {
          setIsUser(true);

          let pubResponse = await getPublications(response.data.profile.id);
          if (pubResponse.data.publications) {
            setPubs(pubResponse.data.publications.items);
          }

          let locksResponse = await getLocksByUser(address);
          if (locksResponse.data.locks) {
            setLocks(locksResponse.data.locks);
          }
        } else {
          setIsUser(false);
        }
      }

      setLoading(false);
    } catch (error) {
      console.log("ERROR:", error);
      setLoading(false);
    }
  }

  return (
    <Layout>
      {mounted && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {loading ? (
            <Loading />
          ) : (
            <>
              {address ? (
                <div className="mx-auto max-w-md sm:max-w-3xl mb-8 sm:mb-12">
                  {isUser ? (
                    <>
                      <h1 className="text-3xl leading-8 text-emerald-900 sm:text-4xl font-cursive font-normal">
                        gm, {profile.handle}
                      </h1>
                      <p className="text-xl text-stone-600 mx-auto mt-4 mb-5">
                        Make yourself at home.
                      </p>
                      <CreateLensPost profile={profile} locks={locks} />
                      <DashboardPosts profile={profile} pubs={pubs} />
                      <DashboardLocks locks={locks} />
                    </>
                  ) : (
                    <WrongDashboard address={address} />
                  )}
                </div>
              ) : (
                <NeedConnectWallet message="Connect your wallet to access your homebase." />
              )}
            </>
          )}
        </div>
      )}
    </Layout>
  );
}
