import { useState } from "react";
import { updateMaxKeys } from "../utils/unlockFunctions";

export default function UpdateLock({ lockAddress, currentMaxKeys }) {
  const [newMaxKeys, setNewMaxKeys] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(currentMaxKeys !== newMaxKeys){
      await updateMaxKeys(lockAddress, newMaxKeys);
    } else {
      alert("You already have that as your max keys")
    }
  };

  return (
    <div className="pt-4">
      <h3 className="text-xl underline">Update Max Keys</h3>
      <form className="pt-4" onSubmit={handleSubmit}>
        <label>Max number of keys that can be minted</label>
        <input
          type="number"
          className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
          required
          min="1"
          step="1"
          onChange={(e) => {
            setNewMaxKeys(e.target.value);
          }}
        ></input>

        <button
          className="my-4 border-2 hover:bg-green-500 hover:text-white border-green-500 px-4 py-2"
          type="submit"
        >
          Update Max Keys
        </button>
      </form>
    </div>
  );
}
