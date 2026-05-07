import ExpandedDetail from "./ExpandedDetail";

export default function TableRow({domain, onDeleteDomain}) {
    return (
        <>
    <p>{domain.name} - latency: {domain.latency}ms</p>
    <button onClick={() => onDeleteDomain(domain.id)}>x</button>
    <ExpandedDetail />
    </>    
)
}