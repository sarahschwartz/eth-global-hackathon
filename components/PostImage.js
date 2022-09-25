import { useState } from "react";

export default function PostImage({ url, altTag, classes }) {
  const [src, setSrc] = useState(url);

  return (
    <>
      {src && (
        <img
          src={src.toString().startsWith("http") ? src : `https://${src}`}
          onError={() => setSrc("/assets/error-image.jpeg")}
          alt={altTag ? altTag : "lens-image"}
          className={classes}
        />
      )}
    </>
  );
}
