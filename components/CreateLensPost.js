import { useState } from "react";
import { createNewPost } from "../utils/lensQueries";

export default function CreateLensPost({ profile, locks }) {
  const [message, setMessage] = useState("");
  const [privatePost, setPrivatePost] = useState(false);
  const [lockAddresses, setLockAddresses] = useState([]);
  const [submitted, setSubmitted] = useState(false)

  const inactiveClasses = "cursor-pointer px-6 py-2 border border-blue-500 rounded-full"
  const activeClasses = "cursor-pointer px-6 py-2 border bg-blue-500 text-white rounded-full"

  const uploadContent = async () => {
    const contentJson = {
      type: "post",
      profile_id: profile.id.toNumber(),
      handle: profile.handle,
      message,
      timestamp: new Date().toISOString(),
      private: privatePost,
      lockAddresses,
    };

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentJson),
      });
      if (response.status !== 200) {
        alert("Oops! Something went wrong. Please refresh and try again.");
      } else {
        console.log("Form successfully submitted!");
        const responseJSON = await response.json();
        return responseJSON.cid;
      }
    } catch (error) {
      alert(
        `Oops! Something went wrong. Please refresh and try again. Error ${error}`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const CID = await uploadContent();

      const request = {
        profileId: profile.id,
        contentURI: `https://ipfs.io/ipfs/${CID}/data.json`,
        collectModule: {
          revertCollectModule: true,
        },
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      };

      const resp = await createNewPost(request);
      console.log("POSTED!", resp);
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const handleLockInput = (address) => {
    if (lockAddresses.includes(address)) {
      let newLocks = lockAddresses.filter((addy) => {
        addy !== address;
      });
      console.log("NEW LOCKS", newLocks);
      setLockAddresses(newLocks);
    } else {
      setLockAddresses(...lockAddresses, address);
    }
  };

  return (
    <div className="py-8">
      <h3 className="text-2xl pb-4">Create a new post</h3>
      {!submitted && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Message</label>
            <textarea
              type="text"
              className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
              required
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="block">Visibility</label>
            <input className={privatePost ? inactiveClasses : activeClasses} type="button" onClick={() => {setPrivatePost(false)}} value="Public"/>
            <input className={privatePost ? activeClasses : inactiveClasses} type="button" onClick={() => {setPrivatePost(true)}} value="Private"/>
          </div>

          {privatePost && (
            <div>
              {locks.map((lock) => {
                <div>
                  <label>{lock.name}</label>
                  <input
                    type="button"
                    className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                    onClick={() => {
                      handleLockInput(lock.address);
                    }}
                  />
                </div>;
              })}
            </div>
          )}

          <button
            className="my-4 border-2 hover:bg-green-500 hover:text-white border-green-500 px-4 py-2"
            type="submit"
          >
            Post
          </button>
        </form>
      )}
      {submitted && <div>New post created!</div>}
    </div>
  );
}
