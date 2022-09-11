import { db } from '../firebaseConfig'
import { doc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { useState } from "react";

export default function UploadContent(){
    const [CID, setCID] = useState("")
    const lockAddress = "0x6e4953f685953e0258e587aa0c67cdaa86f98bcb"

    async function handleSubmit(e) {
        e.preventDefault();
        await updateDoc(doc(db, "locks", lockAddress), {
            CIDs: arrayUnion(CID)
          });
    }

    return (
        <>
            <h2>Upload Content</h2>
            <form onSubmit={handleSubmit}>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="cid"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  CID
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    id="cid"
                    name="cid"
                    type="text"
                    className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                    required
                    value={CID}
                    onChange={(e) => setCID(e.target.value)}
                  />
                </div>
              </div>

            <button type="submit">Submit</button>
            </form>
        </>
    )
}