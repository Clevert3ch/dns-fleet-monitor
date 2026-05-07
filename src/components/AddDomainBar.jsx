import {useState} from "react"


export default function AddDomainBar({onAddDomain}) {
    const [text, setText] = useState("")

    return (
    <>
    <input
    value={text}
    onChange={e => setText(e.target.value)}
    />
    <button onClick={() => onAddDomain(text)}>
        Add
        </button>
    </>
   )
}