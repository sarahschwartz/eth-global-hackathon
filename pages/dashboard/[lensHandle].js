import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { getProfile } from "../../utils/lensQueries";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import UploadContent from "../../components/UploadContent";
import CreateLock from "../../components/CreateLock";
import { getLocksByUser } from "../../utils/unlockQueries";
import GrantKeysForm from "../../components/GrantKeysForm";

export default function Dashboard() {
  const [profile, setProfile] = useState();
  const [locks, setLocks] = useState([]);
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();
  const { lensHandle } = router.query;
  const { address } = useAccount();

  useEffect(() => {
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
    <div>
      <ConnectButton />
      {isUser && (
        <div>
          <h1 className="text-3xl font-bold underline">Creator Dashboard</h1>
          {profile && <div> {profile.handle}</div>}
          {address && <div> {address}</div>}
          <CreateLock />

          <h2 className="text-2xl font-bold">Your Published Locks</h2>
          {locks.length > 0 && (
            <div>
              {locks.map((lock) => (
                <div key={lock.id} className="py-4">
                  <h3 className="text-xl font-bold">{lock.name}</h3>
                  <UploadContent lockAddress={lock.address} />
                  <GrantKeysForm lockAddress={lock.address} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isUser && address && <div>{"Uh oh! This isn't your dashboard"}</div>}
    </div>
  );
}
