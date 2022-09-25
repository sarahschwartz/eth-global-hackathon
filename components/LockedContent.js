import { db, storage } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { checkIfKeyOwner, getLockFromAddress } from "../utils/unlockQueries";
import LockedImages from "./LockedImages";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

export default function LockedContent({ pubId, dbRef, imageRefs }) {
  const [content, setContent] = useState(null);
  const [privateImages, setPrivateImages] = useState([]);
  const [isKeyOwner, setIsKeyOwner] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    if (address && dbRef) {
      getContent();
    }
  }, [dbRef, address]);

  async function getImage(ownerAddress, imgRef) {
    let image = ref(storage, `${ownerAddress}/${imgRef}`);
    let url = await getDownloadURL(image);
    return url;
  }

  async function getImages(ownerAddress) {
    let imageArray = [];
    for (const imgRef of imageRefs) {
      let url = await getImage(ownerAddress, imgRef);
      imageArray.push(url);
    }
    setPrivateImages(imageArray);
  }

  async function getContent() {
    const docRef = doc(db, "locks", dbRef);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();

      for (let i = 0; i < data.lockAddresses.length; i++) {
        let resp = await checkIfKeyOwner(data.lockAddresses[i], address);
        if (resp.data.keys.length > 0 || data.ownerAddress === address) {
          let lockData = await getLockFromAddress(data.lockAddresses[i]);
          if (data.ownerAddress.toLowerCase() === lockData.data.lock.owner) {
            setContent(data.content);
            setIsKeyOwner(true);
            if (imageRefs && imageRefs.length > 0) {
              await getImages(data.ownerAddress);
            }
            break;
          }
        }
      }
    }
  }

  return (
    <>
      {isKeyOwner && content && address ? (
        <>
          <div
            id={"pub-" + pubId}
            className="space-y-4 text-sm text-stone-700 my-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <LockedImages images={privateImages} />
        </>
      ) : (
        <div className="rounded-md bg-blue-50 p-3 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon
                className="h-5 w-5 text-blue-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-2 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">
                You need a membership to unlock this content.
              </p>
              <p className="mt-3 text-sm md:mt-0 md:ml-6">
                <a
                  href="#"
                  className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                >
                  Learn more
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
