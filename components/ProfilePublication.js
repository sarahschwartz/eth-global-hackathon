import { useState, useEffect } from "react";
import LockedContent from "./LockedContent";
import Image from "next/image";

export default function ProfilePublication({ pub, index }) {
  const [contentRef, setContentRef] = useState();
  const [imageRefs, setImageRefs] = useState([]);
  if(pub.metadata.media.length > 0){
    // console.log("MEDIA", pub.metadata.media)
    pub.metadata.media.forEach((media) => {
      console.log("MEDIA!", media.original.url)
    })
  }

  useEffect(() => {
    let imgRefs = [];
    pub.metadata.attributes.forEach((el, index) => {
      if (el.traitType === "dbRef") {
        setContentRef(el.value);
      } else if (el.traitType.startsWith("dbRefImage")) {
        if (!imageRefs.includes(el.value)) {
          imgRefs.push(el.value);
        }
      }
    });
    if (imgRefs.length > 0) {
      setImageRefs(imgRefs);
    }
  }, [pub]);

  // pub.metadata.attributes.length > 0 && p.metadata.attributes[0].traitType === "visibility" && p.metadata.attributes[0].value === "private" &&
  return (
    <div>
      {pub.__typename === "Post" && (
        <div>
          <p className="font-bold">{pub.metadata.name}</p>
          <p>{pub.metadata.content}</p>
          {pub.metadata.media.length > 0 && 
          <div>
              hi
            {pub.metadata.media.map((media, index) => (
            <div key={index}>
              <Image src={"https://"+media.original.url} height="100px" width="100px" alt={media.original.altTag ? media.original.altTag : "lens-image"}/>
            </div>
          ))}
          </div>
          }
          {contentRef && (
            <div>
              <LockedContent dbRef={contentRef} imageRefs={imageRefs} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
