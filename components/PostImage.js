import { useState } from "react";

export default function PostImage({ url, altTag }) {
  const [src, setSrc] = useState(url);

  return (
    <>
      {src && (
        <img
          src={src.toString().startsWith("http") ? src : `https://${src}`}
          onError={() => setSrc("/assets/error-image.jpeg")}
          alt={altTag ? altTag : "lens-image"}
          className="w-full object-cover rounded bg-stone-100"
        />
      )}
    </>
  );
}
