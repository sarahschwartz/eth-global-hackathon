import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { getLockFromAddress, checkIfKeyOwner } from "../../utils/unlockQueries";
import PurchaseKey from "../../components/PurchaseKey";
import LockDetails from "../../components/LockDetails";

export default function LockPage() {
  const [lock, setLock] = useState();
  const [ownsKey, setOwnsKey] = useState(false);
  const router = useRouter();
  const { lockAddress } = router.query;
  const { address } = useAccount();

  useEffect(() => {
    if (lockAddress) {
      async function fetchData() {
        await fetchLock();
        if (address) {
          await handleCheckIfKeyOwner();
        }
      }
      fetchData();
    }
  }, [lockAddress, address]);

  async function fetchLock() {
    try {
      let response = await getLockFromAddress(lockAddress);
      setLock(response.data.lock);
    } catch (error) {
      console.log("ERROR:", error);
    }
  }



  async function handleCheckIfKeyOwner() {
    let resp = await checkIfKeyOwner(lockAddress, address);
    if (resp.data.keys.length > 0) {
      if (resp.data.keys[0].lock.id === lockAddress) {
        setOwnsKey(true);
      }
    }
  }

  // TO DO: get lens profile that made lock
  
  return (
    <div>
      <ConnectButton />
      {lock && (
        <div className="grid place-items-center mt-32">
          <LockDetails lock={lock}/>
          {address && 
          <div>
            {ownsKey ? (
                "You already own this key"
                ) : (
              <PurchaseKey lock={lock} />
            )}
          </div>
          }
        </div>
      )}
    </div>
  );
}
