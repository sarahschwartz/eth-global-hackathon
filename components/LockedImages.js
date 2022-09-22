import Image from "next/image"

export default function LockedImages({ images }){
    return(
        <div>
            {images.map((img) => (
                <Image alt="private content" key={img} src={img} width="100px" height="100px"/>
            ))}

        </div>
    )
}