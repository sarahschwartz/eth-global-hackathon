import { useState } from "react";
import { createPostTypedData } from "../utils/lensQueries";
import { signedTypeData, splitSignature } from "../utils/ethers-service";
import { lensHub } from "../utils/lensHub";

export default function CreateLensPost({ profile, locks }) {
  const [message, setMessage] = useState("");
  const [privatePost, setPrivatePost] = useState(false);
  const [lockAddresses, setLockAddresses] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const inactiveClasses =
    "cursor-pointer px-6 py-2 border border-blue-500 rounded-full";
  const activeClasses =
    "cursor-pointer px-6 py-2 border bg-blue-500 text-white rounded-full";

  const uploadContent = async () => {
    const contentJson = {
      type: "post",
      profile_id: profile.id,
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
      await createPost(CID);
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const createPost = async (CID) => {
    const createPostRequest = {
      profileId: profile.id,
      contentURI: "ipfs://" + CID,
      collectModule: {
        revertCollectModule: true,
      },
      referenceModule: {
        followerOnlyReferenceModule: false
      }
    };
    console.log("CREATE POST REQUEST", createPostRequest)

          
    // const result = await createPostTypedData(createPostRequest);
    // const typedData = result.data.createPostTypedData.typedData;
    
    // const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
    // const { v, r, s } = splitSignature(signature);
    // console.log("POST INPUTS")
    // console.log("ProfileId", typedData.value.profileId)
    // console.log("contentURI", typedData.value.contentURI)
    // console.log("collectModule", typedData.value.collectModule)
    // console.log("collectModuleInitData", typedData.value.collectModuleInitData)
    // console.log("referenceModule", typedData.value.referenceModule)
    // console.log("referenceModuleInitData", typedData.value.referenceModuleInitData)
    // console.log("v", v)
    // console.log("r", r)
    // console.log("s", s)
    // console.log("deadline", typedData.value.deadline)

    
    // const contract = lensHub();
    // const txn = await contract.postWithSig({
    //   profileId: typedData.value.profileId,
    //   contentURI: typedData.value.contentURI,
    //   collectModule: typedData.value.collectModule,
    //   collectModuleInitData: typedData.value.collectModuleInitData,
    //   referenceModule: typedData.value.referenceModule,
    //   referenceModuleInitData: typedData.value.referenceModuleInitData,
    //   sig: {
    //     v,
    //     r,
    //     s,
    //     deadline: typedData.value.deadline,
    //   },
    // });
    // console.log("DONE!", txn);
    // 0x64464dc0de5aac614a82dfd946fc0e17105ff6ed177b7d677ddb88ec772c52d3
    // you can look at how to know when its been indexed here: 
    //   - https://docs.lens.dev/docs/has-transaction-been-indexed
  }

  const handleLockInput = (address) => {
    if (lockAddresses.includes(address)) {
      let newLocks = lockAddresses.filter((addy) => {
        return addy !== address;
      });
      setLockAddresses(newLocks);
    } else {
      setLockAddresses([...lockAddresses, address]);
    }
  };

  const isLockActive = (address) => {
    return lockAddresses.includes(address) ? true : false;
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
            <input
              className={privatePost ? inactiveClasses : activeClasses}
              type="button"
              onClick={() => {
                setPrivatePost(false);
              }}
              value="Public"
            />
            <input
              className={privatePost ? activeClasses : inactiveClasses}
              type="button"
              onClick={() => {
                setPrivatePost(true);
              }}
              value="Private"
            />
          </div>

          {privatePost && (
            <div>
              <label>Locks</label>
              {locks.map((lock) => (
                <div key={lock.id}>
                  <input
                    type="button"
                    value={`${lock.name} - ${lock.address}`}
                    className={
                      isLockActive(lock.address)
                        ? activeClasses
                        : inactiveClasses
                    }
                    onClick={() => {
                      handleLockInput(lock.address);
                    }}
                  />
                </div>
              ))}
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
