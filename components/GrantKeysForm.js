import { useState } from "react";
import { grantKeys } from "../utils/unlockFunctions";

export default function GrantKeysForm({ lockAddress }) {
  const [wallets, setWallets] = useState();
  const [expTime, setExpTime] = useState();
  const [expDate, setExpDate] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("WALLETS", wallets);
    let dateAndTime = new Date(`${expDate} ${expTime}`);
    let timestamp = dateAndTime.getTime();
    console.log("TIMESTAMP", timestamp);
    await grantKeys(lockAddress, wallets, timestamp);
  };
  return (
    <div className="mx-auto w-full mt-5 md:mt-8 pt-5 md:pt-8 border-t border-stone-300">
      <h2 className="text-lg text-stone-900 sm:text-xl font-cursive font-normal">
        Grant access
      </h2>
      <p className="text-stone-600 mt-2 mb-5">
        Grant access to your private content by airdropping keys.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="recipient"
            className="block text-sm font-medium text-stone-700"
          >
            Recipient (ETH address)
          </label>
          <input
            id="recipient"
            name="recipient"
            type="text"
            required
            onChange={(e) => {
              setWallets([e.target.value]);
            }}
            placeholder="Enter their ETH wallet address"
            className="mt-2 block max-w-lg w-full shadow-sm focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm border border-stone-300 rounded-md"
          ></input>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-stone-700 sm:mt-px sm:pt-2"
          >
            Date & time
            <p className="mt-1 max-w-2xl text-sm text-stone-500">
              The date and time the keys will expire
            </p>
          </label>
          <div className="mt-1 sm:mt-0 flex flex-wrap sm:flex-nowrap gap-2">
            <div className="w-1/2">
              <input
                id="date"
                name="date"
                type="date"
                className="max-w-lg block focus:ring-emerald-600 focus:border-emerald-600 w-full shadow-sm sm:max-w-xs sm:text-sm border border-stone-300 rounded-md"
                required
                onChange={(e) => setExpDate(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <input
                id="time"
                name="time"
                type="time"
                className="max-w-lg block focus:ring-emerald-600 focus:border-emerald-600 w-full shadow-sm sm:max-w-xs sm:text-sm border border-stone-300 rounded-md"
                required
                onChange={(e) => setExpTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-transparent bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Grant access
        </button>
      </form>
    </div>
  );
}
