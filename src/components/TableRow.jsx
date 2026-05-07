import ExpandedDetail from "./ExpandedDetail";

export default function TableRow({domain}) {
    return (
        <>
    <p>{domain.name} - latency: {domain.latency}ms</p>
    <ExpandedDetail />
    </>    
)
}