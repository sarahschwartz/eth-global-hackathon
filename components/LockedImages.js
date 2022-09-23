import Image from "next/image"

export default function LockedImages({ images }){
    return(
        <div>
            {images.map((img, index) => (
                <div key={index}>
                    <Image alt="private content" src={img} width="100px" height="100px"/>
                </div>
            ))}

        </div>
    )
}