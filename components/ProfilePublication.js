import { useState, useEffect } from "react";
import LockedContent from "./LockedContent";

export default function ProfilePublication({ pub, index }) {
  const [contentRef, setContentRef] = useState();
  const [imageRefs, setImageRefs] = useState([]);

  useEffect(() => {
    async function checkAttributes() {
      let imgRefs = []
      pub.metadata.attributes.forEach((el, index) => {
        if (el.traitType === "dbRef") {
          setContentRef(el.value);
        } else if (el.traitType.startsWith("dbRefImage")) {
          if (!imageRefs.includes(el.value)) {
            imgRefs.push(el.value);
          }
        }
      });
      setImageRefs(imgRefs)
    }
    checkAttributes();
  }, [pub]);

  // pub.metadata.attributes.length > 0 && p.metadata.attributes[0].traitType === "visibility" && p.metadata.attributes[0].value === "private" &&
  return (
    <div>
      {pub.__typename === "Post" && (
        <div>
          <p className="font-bold">{pub.metadata.name}</p>
          <p>{pub.metadata.content}</p>
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
