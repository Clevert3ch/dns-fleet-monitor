import ExpandedDetail from "./ExpandedDetail"
import StatusDot from "./StatusDot"
import {useState} from "react"


export default function TableRow({domain, onDeleteDomain}) {
    const [isExpanded, setIsExpanded] = useState(false)

    function formatLastSync(timestamp) {
    const diffMs = Date.now() - timestamp
    const seconds = Math.floor(diffMs / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
    }
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