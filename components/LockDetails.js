import { useState, useEffect } from "react";
import { getMaxKeys, getTotalSupply } from "../utils/unlockFunctions";
import { ethers } from "ethers";

export default function LockDetails({ lock }){
    const [currentMaxKeys, setCurrentMaxKeys] = useState(null);
    const [totalSupply, setTotalSupply] = useState(null);
  
    useEffect(() => {
      if (lock.address) {
        async function fetchData() {
            await handleGetMaxKeysAndTotalSupply();
        }
        fetchData();
      }
    }, [lock]);
  
    async function handleGetMaxKeysAndTotalSupply() {
      let resp = await getMaxKeys(lock.address);
      if (resp) {
        setCurrentMaxKeys(resp);
      }
      resp = await getTotalSupply(lock.address);
      if (resp) {
        setTotalSupply(resp);
      }
    }

    return (
        <div>
            <h3 className="text-xl font-bold">{lock.name}</h3>
          <p>Price: {ethers.utils.formatEther(lock.price)} MATIC</p>
          {currentMaxKeys && <p>Max Keys: {currentMaxKeys}</p>}

          <p>Total Supply: {totalSupply ? totalSupply : 0}</p>

        </div>
    )
}