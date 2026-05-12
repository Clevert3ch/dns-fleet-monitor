import {useState} from "react"


export default function AddDomainBar({onAddDomain, onRefreshAll}) {
    const [text, setText] = useState("")

    return (
   
        <form
         className="flex items-center gap-3 mb-6 " 
            onSubmit={(e) => {
            e.preventDefault()
            onAddDomain(text)
            setText("")
        }}>
    <input
    name="domain"
    value={text}
    onChange={e => setText(e.target.value)}
    placeholder="example.com"
    className="flex-1 bg-zinc-900 border border-green-900 rounded-md px-3 py-2 text-green-400 placeholder:text-green-800 focus:outline-none focus:border-green-500"
    />
    <button     
        
        type="submit"
        className="bg-green-900 hover:bg-green-800 text-green-200 px-4 py-2 rounded-md border border-green-700"
    >
        Add
    </button>
    
    <button 
    type="button"
    onClick={() => onRefreshAll()}
    className="ml-auto bg-zinc-900 hover:bg-zinc-800 text-green-400 px-4 py-2 rounded-md border border-green-900"
    >
        Refresh
        </button>
        </form>
   
   )
}