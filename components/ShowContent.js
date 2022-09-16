import { useState, useEffect } from "react"

export default function ShowContent({CID}){
const [text, setText] = useState()

    useEffect(() => {
        fetchContent()
    },[])

    const fetchContent = async () => {
        let response = await fetch(`https://ipfs.io/ipfs/${CID}/data.json`)
        response = await response.json()
        setText(response)
    }


    return (
        <div>
            Content:
            {text && (
                <div>
                    {Object.entries(text).map((key) => <div key={key}>{key[0]}: {key[1]}</div>)}
                </div>
            )}
        </div>
    )
}