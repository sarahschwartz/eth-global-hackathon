import { useState, useEffect } from "react";
import LockedContent from "./LockedContent";
import PostImage from "./PostImage";
// import Image from "next/image";

export default function ProfilePublication({ pub, index }) {
  const [contentRef, setContentRef] = useState();
  const [imageRefs, setImageRefs] = useState([]);

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

  return (
    <div>
      {pub.__typename === "Post" && (
        <div>
          <p className="font-bold">{pub.metadata.name}</p>
          <p>{pub.metadata.content}</p>
          {pub.metadata.media.length > 0 && 
          <div>
            {pub.metadata.media.map((media, index) => (
            <div key={index}>
              <PostImage url={media.original.url} altTag={media.original.altTag}/>
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
