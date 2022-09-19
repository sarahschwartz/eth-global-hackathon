import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { getProfile } from "../../utils/lensQueries";
import { useAccount } from "wagmi";
import DashboardLocks from "../../components/DashboardLocks";
import CreateLock from "../../components/CreateLock";
import { getLocksByUser } from "../../utils/unlockQueries";
import Layout from "../../components/layout/Layout";
import CreateLensPost from "../../components/CreateLensPost";

export default function Dashboard() {
  const [profile, setProfile] = useState();
  const [mounted, setMounted] = useState(false);
  const [locks, setLocks] = useState([]);
  const [isUser, setIsUser] = useState(false);
  const [showCreateLock, setShowCreateLock] = useState(false);
  const router = useRouter();
  const { lensHandle } = router.query;
  const { address } = useAccount();

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
    if (lensHandle) {
      fetchProfile();
    }
  }, [lensHandle, address]);

  async function fetchProfile() {
    try {
      let response = await getProfile({ handle: lensHandle });
      console.log("RESPONSE", response);
      if (response.data.profile) {
        setProfile(response.data.profile);
        if (response.data.profile.ownedBy === address) {
          setIsUser(true);
        } else {
          setIsUser(false);
        }
      }
      response = await getLocksByUser(address);
      console.log("LOCKS BY USER!!", response);
      if (response.data.locks) {
        setLocks(response.data.locks);
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  }
  return (
    <Layout>
      {mounted && (
        <div className="p-8">
          {isUser && profile && (
            <div>
              <h1 className="text-3xl font-bold underline">
                Creator Dashboard
              </h1>
              <div> {profile.handle}</div>

              <CreateLensPost profile={profile} locks={locks}/>

              {!showCreateLock && (
                <button
                  type="button"
                  className="my-4 border-2 hover:bg-green-500 hover:text-white border-green-500 px-4 py-2"
                  onClick={() => {
                    setShowCreateLock(true);
                  }}
                >
                  Create a new lock
                </button>
              )}
              {showCreateLock && <CreateLock />}

              {locks.length > 0 && <DashboardLocks locks={locks} />}
            </div>
          )}

          {!isUser && address && (
            <div>{"Uh oh! This isn't your dashboard"}</div>
          )}
          {!address && (
            <div className="text-center pt-8">
              {"Connect your wallet to view your dashboard"}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
