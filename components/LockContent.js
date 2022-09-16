import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function LockContent({ lockAddress }) {
  const [content, setContent] = useState([]);

  useEffect(() => {
    getContent();
  }, []);

  async function getContent() {
    const docRef = doc(db, "locks", lockAddress);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      console.log("DATA", data.CIDs);
      setContent(data.CIDs);
    }
  }

  return (
    <>
      {content.length > 0 && (
        <div>
          <h3>Published Content for this lock:</h3>
          {content.map((CID, index) => (
            <div key={index}>
              <p className="bg-teal-400 p-4 my-4">
                {CID}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
