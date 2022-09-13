import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ProfileDetails from "../../components/ProfileDetails"
import ProfilePublications from "../../components/ProfilePublications"
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
      <h1 className="text-3xl font-bold underline my-4">Profile Page</h1>
      <ConnectButton />

      {profile && (
        <ProfileDetails profile={profile}/>
      )}

      {pubs.length > 0 && (
        <ProfilePublications pubs={pubs}/>
      )}
    </div>
  );
}
