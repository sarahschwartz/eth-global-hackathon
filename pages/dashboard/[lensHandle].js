import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { getProfile } from "../../utils/lensQueries";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import UploadContent from "../../components/UploadContent";

export default function Dashboard() {
  const [profile, setProfile] = useState();
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
      console.log("RESPONSE", response)
      if(response.data.profile){
        setProfile(response.data.profile);
        if(response.data.profile.ownedBy === address){
          setIsUser(true)
        }
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
                <h1>Creator Dashboard</h1>
                {profile && <div> {profile.handle}</div>}
                {address && <div> {address}</div>}
                <UploadContent/>
            </div>
        )}

        {!isUser && address && (
            <div>{"Uh oh! This isn't your dashboard"}</div>
  )}

    </div>
  );
}
