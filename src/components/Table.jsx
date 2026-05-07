import TableRow from "./TableRow";


export default function Table({domains}) {
    return (
        <>
        {domains.map(domain => (
        <TableRow key={domain.id} domain={domain} />
    ))}
    
    </>    
)
}