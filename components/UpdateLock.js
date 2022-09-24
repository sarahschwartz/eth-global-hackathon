import { useState } from "react";
import { updateMaxKeys } from "../utils/unlockFunctions";

export default function UpdateLock({ lockAddress, currentMaxKeys }) {
  const [newMaxKeys, setNewMaxKeys] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentMaxKeys !== newMaxKeys) {
      await updateMaxKeys(lockAddress, newMaxKeys);
    } else {
      alert("You already have that as your max keys");
    }
  };

  return (
    <div className="mx-auto w-full mt-5 md:mt-8 pt-5 md:pt-8 border-t border-stone-300">
      <h2 className="text-lg text-stone-900 sm:text-xl font-cursive font-normal">
        Update max keys
      </h2>
      <p className="text-stone-600 mt-2 mb-5">
        Manage the maximum number of keys for this lock.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="max-keys"
            className="block text-sm font-medium text-stone-700"
          >
            Max number of keys
          </label>
          <input
            id="max-keys"
            name="max-keys"
            type="number"
            required
            min="1"
            step="1"
            onChange={(e) => {
              setNewMaxKeys(e.target.value);
            }}
            className="mt-2 block shadow-sm focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm border border-stone-300 rounded-md"
          ></input>
        </div>
        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-transparent bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Update
        </button>
      </form>
    </div>
  );
}
