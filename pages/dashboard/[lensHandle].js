import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { getProfile } from "../../utils/lensQueries";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import DashboardLocks from "../../components/DashboardLocks";
import CreateLock from "../../components/CreateLock";
import { getLocksByUser } from "../../utils/unlockQueries";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState();
  const [locks, setLocks] = useState([]);
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();
  const { lensHandle } = router.query;
  const { address } = useAccount();

  useEffect(() => {
    if(!mounted){
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
    mounted && (
    <div>
      <ConnectButton />
      {isUser && (
        <div>
          <h1 className="text-3xl font-bold underline">Creator Dashboard</h1>
          {profile && <div> {profile.handle}</div>}
          {address && <div> {address}</div>}
          <CreateLock />

          {locks.length > 0 && (
            <DashboardLocks locks={locks}/>
          )}
        </div>
      )}

      {!isUser && address && <div>{"Uh oh! This isn't your dashboard"}</div>}
    </div>
    )
  );
}
