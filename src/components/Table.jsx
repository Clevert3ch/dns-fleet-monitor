import TableRow from "./TableRow";


export default function Table({domains, onDeleteDomain}) {
    if (domains.length === 0) {
        return (
            <div className="text-center py-12 text-green-700">
            <p className="text-lg mb-2">No domains being monitored</p>
            <p className="text-sm">Add a domain above to start monitoring DNS health.</p>
            </div>

        )
     }

    return (
    

        <table className="w-full">
        <thead>
                    <tr className="text-xs uppercase tracking-wider text-green-700 text-left border-b border-green-900">
                    <th className="py-2 px-3">Domain</th>
                    <th className="py-2 px-3">A</th>
                    <th className="py-2 px-3">MX</th>
                    <th className="py-2 px-3">SPF</th>
                    <th className="py-2 px-3">DNSSEC</th>
                    <th className="py-2 px-3">Latency</th>
                    <th className="py-2 px-3">Last checked</th>
                    <th className="py-2 px-3"></th>
                    </tr>

        </thead>
        
        <tbody>
        {domains.map(domain => (
        <TableRow 
        key={domain.id} 
        domain={domain}
        onDeleteDomain={onDeleteDomain}
        />
    ))}
    
    </tbody> 
    </table>   
)
}