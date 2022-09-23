import { ethers } from "ethers";
import connectContract from "../utils/connectContract";
import abis from "../utils/unlockABIs";
import { useState } from "react"


export default function CreateLock() {
  const [keyPrice, setKeyPrice] = useState(0)
  const [lockName, setLockName] = useState("Homebase Lock")
  const [maxKeys, setMaxKeys] = useState(1)
  const [expirationDuration, setExpirationDuration] = useState(30)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    await createUpgradeableLock();
  }

  const createUpgradeableLock = async () => {
    try {
      const { contract, signer } = connectContract(
        "0x1FF7e338d5E582138C46044dc238543Ce555C963"
      );
      const lockCreator = await signer.getAddress();

      let days = parseFloat(expirationDuration)
      let max = parseInt(maxKeys)

      const defaultParams = {
        expirationDuration: ethers.BigNumber.from(60 * 60 * 24 * days), // 30 days
        keyPrice: ethers.utils.parseEther(keyPrice), // in wei
        maxNumberOfKeys: max,
        lockName,
      };

      const lockParams = [
        defaultParams.expirationDuration,
        ethers.constants.AddressZero,
        defaultParams.keyPrice,
        defaultParams.maxNumberOfKeys,
        defaultParams.lockName,
      ];

      const lockVersion = 10;
      const version = `v${lockVersion}`;

      const lockAbi = abis.PublicLock[version].abi;
      const lockInterface = new ethers.utils.Interface(lockAbi);

      const calldata = lockInterface.encodeFunctionData(
        "initialize(address,uint256,address,uint256,uint256,string)",
        [lockCreator, ...lockParams]
      );

      const txn = await contract.createUpgradeableLockAtVersion(
        calldata,
        lockVersion
      );
      console.log("Minting...", txn.hash);
      let wait = await txn.wait();
      console.log("Minted -- ", txn.hash);
      console.log("WAITED", wait);
    } catch (error) {
      console.log("CAUGHT ERROR!", error);
    }
  };

  return (
    <div className="py-8">
      <h3 className="text-2xl pb-4">Create a new lock</h3>
      {!submitted && 
      <form onSubmit={handleSubmit}>
        <div>
          <label>Lock name</label>
          <input
            type="text"
            className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
            required
            onChange={(e) => {
              setLockName(e.target.value);
            }}
          ></input>
        </div>

        <div>
          <label>Max number of keys</label>
          <input
            type="number"
            step="1"
            min="1"
            className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
            required
            onChange={(e) => {
              setMaxKeys(e.target.value);
            }}
          ></input>
        </div>

        <div>
          <label>Key Price (MATIC)</label>
          <input
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            placeholder="0.00"
            className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
            required
            onChange={(e) => {
              setKeyPrice(e.target.value);
            }}
          ></input>
        </div>

        <div>
          <label>Expiration duration (days)</label>
          <input
            type="number"
            min="1"
            max="36525" // 100 years
            className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
            required
            onChange={(e) => {
              setExpirationDuration(e.target.value);
            }}
          ></input>
        </div>
        
      

        <button
          className="my-4 border-2 hover:bg-green-500 hover:text-white border-green-500 px-4 py-2"
          type="submit"
        >
          Create Lock
        </button>
      </form>
      }
      {submitted && <div>New lock created!</div>}
    </div>
  );
}
