import {useState} from "react"


export default function AddDomainBar({onAddDomain, onRefreshAll}) {
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
    
    <button onClick={() => onRefreshAll()}>
        Refresh
        </button>
    </>
   )
}