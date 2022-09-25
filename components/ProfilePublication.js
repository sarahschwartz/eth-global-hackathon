import { useState, useEffect } from "react";
import LockedContent from "./LockedContent";
import PostImage from "./PostImage";
import Image from "next/image";
import Link from "next/link";
import { GlobeAltIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import ReactTimeAgo from "react-time-ago";
import PostImages from "./PostImages";

export default function ProfilePublication({ pub, index }) {
  const [contentRef, setContentRef] = useState();
  const [imageRefs, setImageRefs] = useState([]);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    let imgRefs = [];
    pub.metadata.attributes.forEach((el, index) => {
      if (el.traitType === "dbRef") {
        setContentRef(el.value);
        setLocked(true);
      } else if (el.traitType.startsWith("dbRefImage")) {
        if (!imageRefs.includes(el.value)) {
          imgRefs.push(el.value);
        }
        setLocked(true);
      }
    });
    if (imgRefs.length > 0) {
      setImageRefs(imgRefs);
    }
  }, [pub]);

  return (
    <>
      {pub.__typename === "Post" && (
        <li className="bg-white px-4 py-6 shadow rounded-lg sm:p-6">
          <article aria-labelledby={"pub-" + pub.id}>
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                {pub.profile.picture && pub.profile.picture.original ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={pub.profile.picture.url}
                    alt={`${pub.profile.handle} picture`}
                  />
                ) : (
                  <Image
                    width="40"
                    height="40"
                    className="rounded-full"
                    src="/assets/avatar.png"
                    alt="Default avatar"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-stone-900">
                  <a
                    href={`/homebase/${pub.profile.handle}`}
                    className="hover:underline"
                  >
                    {pub.profile.name ? pub.profile.name : pub.profile.handle}
                  </a>
                </p>
                <p className="text-emerald-700 text-sm">
                  @{pub.profile.handle}
                </p>
              </div>
              <div>
                {locked ? (
                  <>
                    <span className="sr-only">Private</span>
                    <LockClosedIcon
                      className="h-5 w-5 text-blue-500"
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  <>
                    <span className="sr-only">Public</span>
                    <GlobeAltIcon
                      className="h-5 w-5 text-stone-500"
                      aria-hidden="true"
                    />
                  </>
                )}
              </div>
            </div>

            {!locked && (
              <>
                <div
                  id={"pub-" + pub.id}
                  className="space-y-4 text-sm text-stone-700 my-4"
                  dangerouslySetInnerHTML={{ __html: pub.metadata.content }}
                />

                <PostImages pub={pub} />
              </>
            )}

            {contentRef && (
              <LockedContent
                pub={pub}
                dbRef={contentRef}
                imageRefs={imageRefs}
              />
            )}

            <p className="text-xs text-stone-500">
              <ReactTimeAgo date={Date.parse(pub.createdAt)} locale="en-US" />
            </p>
            {/* <div className="mt-6 flex justify-between space-x-8">
          <div className="flex space-x-6">
            <span className="inline-flex items-center text-sm">
              <button
                type="button"
                className="inline-flex space-x-2 text-stone-400 hover:text-stone-500"
              >
                <HeartIcon className="h-5 w-5" aria-hidden="true" />
                <span className="font-medium text-stone-900">
                  {question.likes}
                </span>
                <span className="sr-only">likes</span>
              </button>
            </span>
            <span className="inline-flex items-center text-sm">
              <button
                type="button"
                className="inline-flex space-x-2 text-stone-400 hover:text-stone-500"
              >
                <ChatBubbleLeftEllipsisIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
                <span className="font-medium text-stone-900">
                  {question.replies}
                </span>
                <span className="sr-only">replies</span>
              </button>
            </span>
          </div>
        </div> */}
          </article>
        </li>
      )}
    </>
  );
}
