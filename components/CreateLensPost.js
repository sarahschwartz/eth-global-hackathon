import { useState } from "react";
import { createPostTypedData } from "../utils/lensQueries";
import { signedTypeData, splitSignature } from "../utils/ethers-service";
import { lensHub, loginWithLens } from "../utils/lensHub";
import { v4 as uuidv4 } from "uuid";
import {
  uploadIpfsMetadata,
  uploadFiles,
  getLinks,
} from "../utils/ipfs-client";
import pollUntilIndexed from "../utils/pollUntilIndexed";
import { db, storage } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

export default function CreateLensPost({ profile, locks }) {
  const [content, setContent] = useState("");
  const [postName, setPostName] = useState("");
  const [description, setDescription] = useState("");
  const [privatePost, setPrivatePost] = useState(false);
  const [lockAddresses, setLockAddresses] = useState([]);
  const [posting, setPosting] = useState(false);
  const [images, setImages] = useState(null);

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
        displayType: "string",
        traitType: "visibility",
        value: privatePost ? "private" : "public",
      },
    ];

    const media = [];
    let mainContentFocus = "TEXT_ONLY";

    if (!privatePost && images.length > 0) {
      mainContentFocus = "IMAGE";
      let imagesCID = await handleImages();
      let links = await getLinks(imagesCID);
      links.forEach((link, i) => {
        media.push({
          item: "ipfs.io/ipfs/" + link.path,
          type: images[i].type,
          // altTag,
          // cover
        });
      });
    }

    if (privatePost) {
      let newDoc = {
        content,
        lockAddresses,
        ownerAddress: profile.ownedBy,
      };
      if (images.length > 0) {
        Array.from(images).forEach((img, index) => {
          let now = Date.now();
          let imgRef = `${img.name}-${now}`;
          attributes.push({
            displayType: "string",
            traitType: `dbRefImage${index}`,
            value: imgRef,
          });
          let storageRef = ref(storage, `${profile.ownedBy}/${imgRef}`);
          uploadBytes(storageRef, img);
        });
      }

      const docRef = await addDoc(collection(db, "locks"), newDoc);

      attributes.push({
        displayType: "string",
        traitType: "dbRef",
        value: docRef.id,
      });
    }

    const metadata = {
      version: "2.0.0",
      metadata_id: uuidv4(),
      appId: "homebase420",
      description,
      content: privatePost ? "This content requires a Homebase key" : content,
      name: postName,
      media,
      attributes,
      locale: "en",
      mainContentFocus,
    };

    console.log("METADATA", metadata);

    const ipfsResult = await uploadIpfsMetadata(metadata);
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

    setPosting(false);
    alert("Success!");
  };

  const handleImages = async () => {
    let filesArray = [];
    for (let i = 0; i < images.length; i++) {
      filesArray.push(images[i]);
    }
    let cid = await uploadFiles(filesArray);
    return cid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (privatePost && lockAddresses.length < 1) {
      alert("You need to select at least one lock for private content");
    } else {
      try {
        setPosting(true);
        await loginWithLens();
        await createPost();
      } catch (error) {
        console.log("ERROR", error);
      }
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
            <label>Images</label>
            <input
              type="file"
              className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
              accept="image/png, image/jpeg"
              multiple
              onChange={(e) => {
                setImages(e.target.files);
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
