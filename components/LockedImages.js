import Image from "next/image";

export default function LockedImages({ images }) {
  return (
    <>
      {images.length > 0 && (
        <div className="flex flex-wrap space-x-3 mb-5">
          {images.length == 1 ? (
            <>
              {images.map((img, index) => (
                <div key={`private-${index}`} className="relative w-full h-80">
                  <Image
                    src={img}
                    alt="private content"
                    layout="fill"
                    objectFit="cover"
                    className="rounded bg-stone-100"
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              {images.map((img, index) => (
                <div key={`private-${index}`} className="relative w-20 h-20">
                  <Image
                    src={img}
                    alt="private content"
                    layout="fill"
                    objectFit="cover"
                    className="rounded bg-stone-100"
                  />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
}
