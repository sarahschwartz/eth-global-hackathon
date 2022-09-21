import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { checkIfKeyOwner, getLockFromAddress } from "../utils/unlockQueries";

export default function LockedContent({ dbRef }) {
  const [content, setContent] = useState(null);
  const [isKeyOwner, setIsKeyOwner] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    if (address && dbRef) {
      getContent();
    }
  }, [dbRef, address]);

  async function getContent() {
    const docRef = doc(db, "locks", dbRef);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();

      for (let i = 0; i < data.lockAddresses.length; i++) {
        let resp = await checkIfKeyOwner(data.lockAddresses[i], address);
        if (resp.data.keys.length > 0) {
          let lockData = await getLockFromAddress(data.lockAddresses[i]);
          if (data.ownerAddress.toLowerCase() === lockData.data.lock.owner) {
            setContent(data.content);
            setIsKeyOwner(true);
            break;
          }
        }
      }
    }
  }

  return (
    <div>
      {isKeyOwner && content && address && <p className="text-blue-800">{content}</p>}
    </div>
  );
}
