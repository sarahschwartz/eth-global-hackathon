import { useState } from "react";
import { grantKeys } from "../utils/unlockFunctions";

export default function GrantKeysForm({ lockAddress }) {
  const [wallets, setWallets] = useState();
  const [timestamp, setTimestamp] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("WALLETS", wallets);
    console.log("TIMESTAMP", timestamp);
    // await grantKeys(lockAddress, wallets, timestamp);
  };
  return (
    <div>
      <div>Grant keys to a list of wallet addresses</div>
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
        <label>Expiration date</label>
        <input
          id="date"
          name="date"
          type="date"
          className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
          required
          onChange={(e) => {
            setTimestamp(e.target.value);
          }}
        ></input>
        <button
          className="my-4 border-2 hover:bg-green-500 hover:text-white border-green-500 px-4 py-2"
          type="submit"
        >
          Grant Keys
        </button>
      </form>
    </div>
  );
}
