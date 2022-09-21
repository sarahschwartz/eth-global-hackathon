import { useState } from "react";
import { createPostTypedData } from "../utils/lensQueries";
import { signedTypeData, splitSignature } from "../utils/ethers-service";
import { lensHub } from "../utils/lensHub";
import { v4 as uuidv4 } from "uuid";
import { uploadIpfs } from "../utils/ipfs-client";
import pollUntilIndexed from "../utils/pollUntilIndexed";
import { db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export default function CreateLensPost({ profile, locks }) {
  const [content, setContent] = useState("");
  const [postName, setPostName] = useState("");
  const [description, setDescription] = useState("");
  const [privatePost, setPrivatePost] = useState(false);
  const [lockAddresses, setLockAddresses] = useState([]);
  const [posting, setPosting] = useState(false);

  const inactiveClasses =
    "cursor-pointer px-6 py-2 border border-blue-500 rounded-full";
  const activeClasses =
    "cursor-pointer px-6 py-2 border bg-blue-500 text-white rounded-full";

  const createPost = async () => {
    const profileId = profile.id;
    if (!profileId) {
      throw new Error("Must define PROFILE_ID in the .env to run this");
    }
    
    
    const attributes = [
     {
       "displayType": "string",
       "traitType": "visibility",
       "value": privatePost ? "private" : "public"
     }
   ]
  if(privatePost){
    const docRef = await addDoc(collection(db, "locks"), {
      content,
      lockAddresses,
      ownerAddress: profile.ownedBy
    });
    console.log("Document written with ID: ", docRef.id);


    attributes.push({
      "displayType": "string",
      "traitType": "dbRef",
      "value": docRef.id
    })
  }



    const metadata = {
      version: "1.0.0",
      metadata_id: uuidv4(),
      appId: "homebase420",
      description,
      content: privatePost ? "This content requires a Homebase key" : content,
      name: postName,
      media: [],
      attributes,
    };

    console.log("METADATA", metadata)

    const ipfsResult = await uploadIpfs(metadata);
    console.log("create post: ipfs result", ipfsResult);

    // hard coded to make the code example clear
    const createPostRequest = {
      profileId,
      contentURI: "ipfs://" + ipfsResult.path,
      collectModule: {
        // feeCollectModule: {
        //   amount: {
        //     currency: currencies.enabledModuleCurrencies.map(
        //       (c: any) => c.address
        //     )[0],
        //     value: '0.000001',
        //   },
        //   recipient: address,
        //   referralFee: 10.5,
        // },
        // revertCollectModule: true,
        freeCollectModule: { followerOnly: true },
        // limitedFeeCollectModule: {
        //   amount: {
        //     currency: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
        //     value: '2',
        //   },
        //   collectLimit: '20000',
        //   recipient: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
        //   referralFee: 0,
        // },
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };
    console.log("CREATE POST REQUEST", createPostRequest);

    const result = await createPostTypedData(createPostRequest);
    console.log("create post: createPostTypedData", result);

    const typedData = result.data.createPostTypedData.typedData;
    console.log("create post: typedData", typedData);

    const signature = await signedTypeData(
      typedData.domain,
      typedData.types,
      typedData.value
    );
    console.log("create post: signature", signature);

    const { v, r, s } = splitSignature(signature);
    const contract = lensHub();

    const tx = await contract.postWithSig({
      profileId: typedData.value.profileId,
      contentURI: typedData.value.contentURI,
      collectModule: typedData.value.collectModule,
      collectModuleInitData: typedData.value.collectModuleInitData,
      referenceModule: typedData.value.referenceModule,
      referenceModuleInitData: typedData.value.referenceModuleInitData,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });
    console.log("create post: tx hash", tx.hash);

    const indexedResult = await pollUntilIndexed(tx.hash);
    console.log("tx", tx);

    console.log("create post: profile has been indexed", result);

    const logs = indexedResult.txReceipt.logs;

    console.log("create post: logs", logs);
    

    // const topicId = utils.id(
    //   "PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)"
    // );
    // console.log("topicid we care about", topicId);

    // const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);
    // console.log("create post: created log", profileCreatedLog);

    // let profileCreatedEventLog = profileCreatedLog.topics;
    // console.log("create post: created event logs", profileCreatedEventLog);

    // const publicationId = utils.defaultAbiCoder.decode(
    //   ["uint256"],
    //   profileCreatedEventLog[2]
    // )[0];

    // console.log(
    //   "create post: contract publication id",
    //   BigNumber.from(publicationId).toHexString()
    // );
    // console.log(
    //   "create post: internal publication id",
    //   profileId + "-" + BigNumber.from(publicationId).toHexString()
    // );

    setPosting(false);
    alert('Success!')

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setPosting(true)
      await createPost();
    } catch (error) {
      console.log("ERROR", error);
    }
  };

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
      {!posting && (
        <form onSubmit={handleSubmit}>

          <div>
            <label>Content</label>
            <textarea
              type="text"
              className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
              required
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </div>

          <div>
            <label>Name</label>
            <input
              type="text"
              className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
              required
              onChange={(e) => {
                setPostName(e.target.value);
              }}
            />
          </div>

          <div>
            <label>Description</label>
            <input
              type="text"
              className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
              required
              onChange={(e) => {
                setDescription(e.target.value);
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
      {posting && <div>Posting....</div>}
    </div>
  );
}
