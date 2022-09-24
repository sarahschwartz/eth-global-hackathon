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
import Loading from "./placeholders/Loading";

export default function CreateLensPost({ profile, locks }) {
  const [content, setContent] = useState("");
  const [privatePost, setPrivatePost] = useState(false);
  const [lockAddresses, setLockAddresses] = useState([]);
  const [posting, setPosting] = useState(false);
  const [images, setImages] = useState([]);

  const inactiveClasses =
    "cursor-pointer inline-flex items-center rounded-full border border-emerald-700 px-2.5 py-1.5 text-xs font-medium text-emerald-700 shadow-sm hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 mr-1";
  const activeClasses =
    "cursor-pointer inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 mr-1";

  const createPost = async () => {
    const profileId = profile.id;
    if (!profileId) {
      throw new Error("Must have profile");
    }

    const postName = `Post by ${profile.handle}`;
    const description = `Swing by ${profile.handle} Homebase to check out more content`;

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
      console.log("PRIVATE");
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
      console.log("DOC REF", docRef);
      attributes.push({
        displayType: "string",
        traitType: "dbRef",
        value: docRef.id,
      });
    }

    console.log("ATTRIBUTES", attributes);

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
        setPosting(false);
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
    <div>
      {!posting && (
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-lg border border-stone-300"
        >
          <div>
            <label htmlFor="content" className="sr-only">
              Content
            </label>
            <textarea
              required
              type="text"
              id="content"
              name="content"
              rows={5}
              placeholder="What's happening at your homebase?"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              className="block w-full rounded-t-lg border-0 border-b border-stone-300 focus:border focus:border-emerald-700 focus:ring-emerald-500"
            />
          </div>

          <div className="px-2 py-3 sm:px-3">
            <label
              htmlFor="visibility"
              className="flex flex-wrap items-center text-sm text-stone-700 mb-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>

              <span>Who can see this post?</span>
            </label>
            <div className="flex flex-wrap">
              <input
                name="visibility"
                type="button"
                onClick={() => {
                  setPrivatePost(false);
                }}
                value="Public"
                className={privatePost ? inactiveClasses : activeClasses}
              />
              <input
                name="visibility"
                type="button"
                onClick={() => {
                  setPrivatePost(true);
                }}
                value="Private"
                className={privatePost ? activeClasses : inactiveClasses}
              />
            </div>

            {privatePost && (
              <div className="mt-3 space-y-1">
                <label htmlFor="lock" className="block text-xs text-stone-700">
                  Pick the lock (membership) required to view this post
                </label>

                {locks.map((lock) => (
                  <div key={lock.id}>
                    <input
                      name="lock"
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
          </div>

          <div className="border-t border-stone-300 flex items-center justify-between space-x-3 px-2 py-2 sm:px-3">
            <div className="flex items-center">
              <label
                htmlFor="file-upload"
                className="flex items-center relative cursor-pointer rounded-md text-emerald-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 hover:text-emerald-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                {images.length > 0 ? (
                  <span className="text-sm text-emerald-700 font-medium">
                    {images.length} files
                  </span>
                ) : (
                  <span className="text-sm text-stone-700">Upload files</span>
                )}
                <input
                  type="file"
                  id="file-upload"
                  name="file-upload"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={(e) => {
                    setImages(e.target.files);
                  }}
                  className="sr-only"
                />
              </label>
              {images.length > 0 && (
                <div className="flex items-center ml-1">
                  <span className="sr-only">Clear files</span>
                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="inline-flex items-center rounded-full border border-transparent"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-stone-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      )}
      {posting && <Loading />}
    </div>
  );
}
