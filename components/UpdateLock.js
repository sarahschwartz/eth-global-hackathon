import { useState } from "react"
import { updateMaxKeys } from "../utils/unlockFunctions"

export default function UpdateLock({lockAddress}){
const  [maxKeys, setMaxKeys] = useState()

const handleSubmit = async (e) => {
    e.preventDefault();
    await updateMaxKeys(lockAddress, maxKeys)
}

    return (
        <div>
            <h3>Update Max Keys</h3>
      <form onSubmit={handleSubmit}>
        <label>Max number of keys that can be minted</label>
        <input
          type="number"
          className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
          required
          onChange={(e) => {
        setMaxKeys(e.target.value);
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
    )
}