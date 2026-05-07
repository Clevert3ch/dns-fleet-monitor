import TableRow from "./TableRow";


export default function Table({domains, onDeleteDomain}) {
    return (
        <>
        {domains.map(domain => (
        <TableRow 
        key={domain.id} 
        domain={domain}
        onDeleteDomain={onDeleteDomain}
        />
    ))}
    
    </>    
)
}