import Image from "next/image";

export default function LockedImages({ images }) {
  return (
    <>
      {images.length > 0 && (
        <div className="flex flex-wrap space-x-3 mb-5">
          {images.length == 1 ? (
            <div className="relative">
              {images.map((img, index) => (
                <Image
                  key={`private-${index}`}
                  src={img}
                  alt="private content"
                  layout="fill"
                  objectFit="cover"
                />
              ))}
            </div>
          ) : (
            <div className="relative w-20">
              {images.map((img, index) => (
                <Image
                  key={`private-${index}`}
                  src={img}
                  alt="private content"
                  layout="fill"
                  objectFit="cover"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
