import PostImage from "./PostImage";

export default function PostImages({ pub }) {
  return (
    <>
      {pub.metadata.media.length > 0 && (
        <div className="flex flex-wrap space-x-3 mb-5">
          {pub.metadata.media.length == 1 ? (
            <>
              {pub.metadata.media.map((media, index) => (
                <PostImage
                  key={`public-${index}`}
                  url={media.original.url}
                  altTag={media.original.altTag}
                />
              ))}
            </>
          ) : (
            <div className="w-20">
              {pub.metadata.media.map((media, index) => (
                <PostImage
                  key={`public-${index}`}
                  url={media.original.url}
                  altTag={media.original.altTag}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
