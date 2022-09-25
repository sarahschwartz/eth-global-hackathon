import { ethers } from "ethers";
import connectContract from "../utils/connectContract";
import abis from "../utils/unlockABIs";
import { useState } from "react";
import Loading from "./placeholders/Loading";
import Link from "next/link";
import Success from "./placeholders/Success";

export default function CreateLock() {
  const [keyPrice, setKeyPrice] = useState(0);
  const [lockName, setLockName] = useState("Homebase Lock");
  const [maxKeys, setMaxKeys] = useState(1);
  const [expirationDuration, setExpirationDuration] = useState(30);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);
    await createUpgradeableLock();
  };

  const createUpgradeableLock = async () => {
    try {
      const { contract, signer } = connectContract(
        "0x1FF7e338d5E582138C46044dc238543Ce555C963"
      );
      const lockCreator = await signer.getAddress();

      let days = parseFloat(expirationDuration);
      let max = parseInt(maxKeys);

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

      setLoading(false);
      setError(false);
    } catch (error) {
      console.log("CAUGHT ERROR!", error);
      setLoading(false);
      setSubmitted(false);
      setError(true);
    }
  };

  return (
    <>
      {!submitted && (
        <>
          <h1 className="text-center text-3xl leading-8 text-emerald-800 sm:text-4xl font-cursive font-normal">
            Create a lock
          </h1>
          <p className="text-center text-xl text-stone-600 mx-auto mt-4">
            Create a lock that represents a membership to your homebase.
          </p>
          <div className="mx-auto w-full mt-5 md:mt-8 pt-5 md:pt-8 border-t border-stone-300">
            <h2 className="text-lg text-stone-900 sm:text-xl font-cursive font-normal">
              Lock details
            </h2>
            <p className="text-stone-600 mt-2 mb-5">
              Customize the lock to your needs.
            </p>
            <form className="space-y-6 mx-auto" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="lock-name"
                  className="block text-sm font-medium text-stone-700"
                >
                  Lock name
                  <p className="mt-1 text-stone-500">Name of your membership</p>
                </label>
                <input
                  id="lock-name"
                  name="lock-name"
                  type="text"
                  required
                  onChange={(e) => {
                    setLockName(e.target.value);
                  }}
                  className="mt-2 block max-w-md w-full shadow-sm focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm border border-stone-300 rounded-md"
                ></input>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-stone-700"
                >
                  Key price (in MATIC)
                  <p className="mt-1 text-stone-500">
                    Cost of your membership from 0 to billions
                  </p>
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  placeholder="0.00"
                  required
                  onChange={(e) => {
                    setKeyPrice(e.target.value);
                  }}
                  className="mt-2 block max-w-md w-full shadow-sm focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm border border-stone-300 rounded-md"
                ></input>
              </div>

              <div>
                <label
                  htmlFor="max-keys"
                  className="block text-sm font-medium text-stone-700"
                >
                  Max number of keys
                  <p className="mt-1 text-stone-500">
                    Maximum number of members
                  </p>
                </label>
                <input
                  id="max-keys"
                  name="max-keys"
                  type="number"
                  step="1"
                  min="1"
                  required
                  onChange={(e) => {
                    setMaxKeys(e.target.value);
                  }}
                  className="mt-2 block max-w-md w-full shadow-sm focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm border border-stone-300 rounded-md"
                ></input>
              </div>

              <div>
                <label
                  htmlFor="expiration"
                  className="block text-sm font-medium text-stone-700"
                >
                  Duration (in days)
                  <p className="mt-1 text-stone-500">
                    Number of days the membership is valid for
                  </p>
                </label>
                <input
                  id="expiration"
                  name="expiration"
                  type="number"
                  min="1"
                  max="36525" // 100 years
                  required
                  onChange={(e) => {
                    setExpirationDuration(e.target.value);
                  }}
                  className="mt-2 block max-w-md w-full shadow-sm focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm border border-stone-300 rounded-md"
                ></input>
              </div>

              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Create lock
              </button>
            </form>
          </div>
        </>
      )}
      {submitted && (
        <>
          {loading ? (
            <Loading />
          ) : (
            <>
              {!error && (
                <div className="text-center">
                  <Success />
                  <h3 className="text-lg text-emerald-800 font-cursive">
                    Lock created
                  </h3>
                  <p className="mt-1 text-stone-500">
                    Your new lock <span className="font-bold">{lockName}</span>{" "}
                    is ready to be shared!
                  </p>
                  <Link href={`/locks/manage`}>
                    <a className="inline-flex items-center rounded-md border border-transparent bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                      Manage my locks
                    </a>
                  </Link>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
