import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CreateLock from "../../components/CreateLock";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getProfile, getPublications } from "../../utils/lensQueries";

export default function Profile() {
  const [profile, setProfile] = useState();
  const [pubs, setPubs] = useState([]);
  const router = useRouter();
  const { lensHandle } = router.query;

  useEffect(() => {
    if (lensHandle) {
      fetchProfile();
    }
  }, [lensHandle]);

  async function fetchProfile() {
    try {
      let response = await getProfile({ handle: lensHandle });
      console.log("PROFILE:", response);
      setProfile(response.data.profile);

      response = await getPublications(response.data.profile.id);
      console.log("PUBS:", response.data.publications.items);
      setPubs(response.data.publications.items);
    } catch (error) {
      console.log("ERROR:", error);
    }
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <ConnectButton />
      <CreateLock />

      {profile && (
        <div>
          <h2>{profile.name}</h2>
          <h3>{profile.handle}</h3>
          <div className="flex flex-wrap gap-x-2 text-gray-600 text-sm sm:text-base mb-4 justify-center md:justify-start">
            <p>
              <span className="text-gray-900 font-medium">
                {profile.stats.totalFollowers}
              </span>{" "}
              Followers
            </p>
            <p>
              <span className="text-gray-900 font-medium">
                {profile.stats.totalFollowing}
              </span>{" "}
              Following
            </p>
          </div>
          <p className="mb-4">{profile.bio}</p>
        </div>
      )}

      {pubs.length > 0 && (
        <div className="border-t-2 border-gray-100 my-8 py-8 flex flex-col space-y-8">
          {pubs.map((p, index) => (
            <div key={p.id}>
              <p className="font-bold">{p.__typename}</p>
              <p>{p.metadata.content}</p>
              <p>{p.metadata.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
