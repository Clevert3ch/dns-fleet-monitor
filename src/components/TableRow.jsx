import ExpandedDetail from "./ExpandedDetail"
import StatusDot from "./StatusDot"
import {useState} from "react"
import formatLastSync from "../utils/formatLastSync"
import useNow from "../utils/useNow"


export default function TableRow({domain, onDeleteDomain}) {
    const [isExpanded, setIsExpanded] = useState(false)
    const now = useNow()
    
    return (
        <>
        <tr onClick={() => setIsExpanded(prev => !prev)} className="border-b border-green-950 hover:bg-zinc-900 cursor-pointer">
            <td className="py-3 px-3 font-bold">{domain.name}</td>
            <td className="py-3 px-3"><StatusDot status={domain.checks.a.status} /></td>
            <td className="py-3 px-3"><StatusDot status={domain.checks.mx.status} /></td>
            <td className="py-3 px-3"><StatusDot status={domain.checks.spf.status} /></td>
            <td className="py-3 px-3"><StatusDot status={domain.checks.dnssec.status} /></td>
            <td className="py-3 px-3">{domain.latency}ms</td>
            <td className="py-3 px-3 text-green-700">{formatLastSync(domain.lastChecked)}</td>
            <td className="py-3 px-3">
    <button onClick={(e) => {
        e.stopPropagation()
        onDeleteDomain(domain.id)}}
        className="text-green-800 hover:text-red-500 transition-colors"
        >
        X
        </button>
    </td>
    </tr>
    {isExpanded && (
       <tr>
           <td colSpan="8" className="bg-zinc-900 p-4">
               <ExpandedDetail domain={domain} />
           </td>
       </tr>
   )} 
   </>   
)
}