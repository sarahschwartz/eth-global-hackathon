import Image from "next/image"
import { useState } from "react"

export default function PostImage({ url, altTag}){
    const [src, setSrc] = useState(url)

    return (
        <div>
            {src &&
                <img src={src.toString().startsWith("http") ? src : `https://${src}`} onError={() => setSrc('/assets/error-image.jpeg')} height="100px" width="100px" alt={altTag ? altTag : "lens-image"}/>
            }
        </div>
    )
}