import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function UploadContent({ lockAddress }) {
  const [CID, setCID] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const docRef = doc(db, "locks", lockAddress);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      alert("Oops! Try again")
    } else {
      await setDoc(docRef, {
        CIDs:[CID],
      });
    }

  }

  return (
    <>
      <h2 className="py-2">Upload an IPFS CID to this lock</h2>
      <form className="py-4" onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="cid" className="font-bold">
            CID
          </label>
          <div className="">
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

        <button
          className="border border-solid border-blue-600 py-2 px-4"
          type="submit"
        >
          Upload
        </button>
      </form>
    </>
  );
}
