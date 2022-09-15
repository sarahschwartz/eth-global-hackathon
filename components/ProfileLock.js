import { ethers } from "ethers";
import { useState, useEffect } from "react";
import PurchaseKey from "./PurchaseKey";
import { getMaxKeys, getTotalSupply } from "../utils/unlockFunctions";

export default function DashboardLocks({ lock }) {
  const [maxKeys, setMaxKeys] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);

  useEffect(() => {
    handleGetMaxKeysAndTotalSupply();
  },)

  const handleGetMaxKeysAndTotalSupply = async () => {
    let resp = await getMaxKeys(lock.address);
    setMaxKeys(resp);
    resp = await getTotalSupply(lock.address);
    setTotalSupply(resp);
  };


  return (
        <div className="py-4">
          <h3 className="text-xl font-bold">{lock.name}</h3>
          <p>Price: {ethers.utils.formatEther(lock.price)} MATIC</p>
          <PurchaseKey lock={lock} />
          {maxKeys && <div>Max Keys: {maxKeys}</div>}
          {totalSupply !== null && <div>Total Supply: {totalSupply}</div>}
          
        </div>
  )
}
