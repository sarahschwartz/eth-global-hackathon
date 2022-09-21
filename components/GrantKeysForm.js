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
    <div className="pt-4">
      <h3 className="text-xl underline">Grant keys</h3>
      <form onSubmit={handleSubmit}>
        <label>ETH address to send a key to:</label>
        <input
          type="text"
          className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
          required
          onChange={(e) => {
            setWallets([e.target.value]);
          }}
        ></input>
        
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Date & time
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">
                    The date and time the keys will expire
                  </p>
                </label>
                <div className="mt-1 sm:mt-0 flex flex-wrap sm:flex-nowrap gap-2">
                  <div className="w-1/2">
                    <input
                      id="date"
                      name="date"
                      type="date"
                      className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                      required
                      onChange={(e) => setExpDate(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      id="time"
                      name="time"
                      type="time"
                      className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                      required
                      onChange={(e) => setExpTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

        <button
          className="my-4 border-2 hover:bg-green-500 hover:text-white border-green-500 px-4 py-2"
          type="submit"
        >
          Grant Key
        </button>
      </form>
    </div>
  );
}
