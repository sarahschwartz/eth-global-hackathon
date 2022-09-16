import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { getLockFromAddress, checkIfKeyOwner } from "../../utils/unlockQueries";
import PurchaseKey from "../../components/PurchaseKey";
import { getMaxKeys, getTotalSupply } from "../../utils/unlockFunctions";
import LockContent from "../../components/LockContent";

export default function LockPage() {
  const [lock, setLock] = useState();
  const [maxKeys, setMaxKeys] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [ownsKey, setOwnsKey] = useState(false);
  const router = useRouter();
  const { lockAddress } = router.query;
  const { address } = useAccount();

  useEffect(() => {
    if (lockAddress) {
      async function fetchData() {
        await fetchLock();
        if (address) {
          await handleGetMaxKeysAndTotalSupply();
          await handleCheckIfKeyOwner();
        }
      }
      fetchData();
    }
  }, [lockAddress, address]);

  async function fetchLock() {
    try {
      console.log("LOCK ADDRESS", lockAddress);
      let response = await getLockFromAddress(lockAddress);
      console.log("LOCK", response);
      setLock(response.data.lock);
    } catch (error) {
      console.log("ERROR:", error);
    }
  }

  async function handleGetMaxKeysAndTotalSupply() {
    let resp = await getMaxKeys(lockAddress);
    if (resp) {
      setMaxKeys(resp);
      console.log("RESSSP", resp);
    }
    resp = await getTotalSupply(lockAddress);
    if (resp) {
      console.log("RESSSP", resp);
      setTotalSupply(resp);
    }
  }

  async function handleCheckIfKeyOwner() {
    console.log("LOCK ADDRESS", lockAddress);
    console.log("ADDRESS", address);
    let resp = await checkIfKeyOwner(lockAddress, address);
    console.log("KEY OWNER RESP", resp);
    if (resp.data.keys.length > 0) {
      if (resp.data.keys[0].lock.id === lockAddress) {
        console.log("THIIIS", resp.data.keys[0].lock.id)
        console.log("EQUALS THIIIS", lockAddress)
        setOwnsKey(true);
      }
    }
  }

  // TO DO: get lens profile that made lock
  
  return (
    <div>
      <ConnectButton />
      {lock && (
        <div>
          <h3 className="text-xl font-bold">{lock.name}</h3>
          <p>Price: {ethers.utils.formatEther(lock.price)} MATIC</p>
          {maxKeys && <div>Max Keys: {maxKeys}</div>}
          {totalSupply !== null && <div>Total Supply: {totalSupply}</div>}
          {ownsKey ? (
              <LockContent lockAddress={lockAddress} />
              ) : (
            <PurchaseKey lock={lock} />
          )}
        </div>
      )}
    </div>
  );
}
