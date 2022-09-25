import { useState, useEffect } from "react";
import { getTimeline, getProfiles } from "../utils/lensQueries";
import { useAccount } from "wagmi";
import { loginWithLens } from "../utils/lensHub";
import Layout from "../components/layout/Layout";
import ProfilePublication from "../components/ProfilePublication";
import Head from "next/head";

export default function Timeline() {
  const [timelinePubs, setTimelinePubs] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setMounted(true);
    if (address) {
      goGetTimeline();
    }
  }, [address]);

  const handleLogin = async () => {
    await loginWithLens();
    await goGetTimeline();
    setShowLogin(false);
  };

  const goGetTimeline = async () => {
    try {
      let resp = await getProfiles({ ownedBy: address });
      console.log("RESP", resp);
      if (resp.data.profiles.items.length > 0) {
        let profileId = resp.data.profiles.items[0].id;
        let request = {
          profileId,
          limit: 20,
        };
        resp = await getTimeline(request);
        console.log("RESPONSE", resp);
        setTimelinePubs(resp.data.timeline.items);
      } else {
        console.log("You don't have a profile yet");
      }
    } catch (error) {
      setShowLogin(true);
    }
  };

  return (
    <Layout>
      <Head>
        <title>My feed | Homebase</title>
      </Head>
      <div className="m-8">
        {showLogin && (
          <button
            onClick={handleLogin}
            className="border border-blue-800 rounded-lg py-2 px-4"
          >
            Login with Lens
          </button>
        )}
        {timelinePubs.length > 0 && (
          <div>
            {timelinePubs.map((pub, index) => (
              <div key={pub.id} className="py-4">
                <ProfilePublication pub={pub} />
              </div>
            ))}
          </div>
        )}
        {mounted && !address && (
          <div>Connect your wallet to see your timeline</div>
        )}
      </div>
    </Layout>
  );
}
