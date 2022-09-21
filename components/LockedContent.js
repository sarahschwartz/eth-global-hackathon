import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { checkIfKeyOwner } from "../utils/unlockQueries";

export default function LockedContent({ dbRef }) {
  const [content, setContent] = useState(null);
  const [isKeyOwner, setIsKeyOwner] = useState(false)
  const { address } = useAccount();

  useEffect(() => {
    if(address && dbRef){
      getContent();
    }
  }, [dbRef, address]);

  async function getContent() {
    const docRef = doc(db, "locks", dbRef);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      console.log("DATA", data);
      
      for (let i = 0; i < data.lockAddresses.length; i++) {
        let resp = await checkIfKeyOwner(data.lockAddresses[i], address);
        if(resp.data.keys.length > 0){
          setContent(data.content)
          console.log("DATA CONTENT", data.content)
          setIsKeyOwner(true);
          break
        }
      }
    }
  }

  return( 
  <div className="py-8">
    {isKeyOwner && content && address && <div>
      {content}
      </div>}
  </div>
  );
}
