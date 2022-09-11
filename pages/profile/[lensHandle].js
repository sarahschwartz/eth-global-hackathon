import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CreateLock from "../../components/CreateLock"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getProfile } from "../../utils/lensQueries";

export default function Profile(){

    const router = useRouter();
    const { lensHandle } = router.query;

  useEffect(() => {
    if (lensHandle) {
      fetchProfile();
    }
  }, [lensHandle]);

  console.log("ID", lensHandle)

  async function fetchProfile() {
    try {
      const response = await getProfile({ handle: lensHandle })
      console.log("PROFILE:", response);
    //   setProfile(response.data.profile);

    //   const publications = await client
    //     .query(getPublicationsById, { id })
    //     .toPromise();
    //   console.log("PUBS!", publications);
    //   setPubs(publications.data.publications.items);
    } catch (error) {
      console.log("ERROR:", error);
    }
  }

    return(
        <div>
            <h1>Profile Page</h1>
            <ConnectButton/>
            <CreateLock/>

            {/* <button onClick={getProfile}>get</button> */}

            {/* get all locks for this wallet*/}
        </div>
    )
}