const colorByStatus = {
    ok:      "bg-green-500",
    warning: "bg-yellow-500",
    fail:    "bg-red-500",
    pending: "bg-zinc-600 animate-pulse",
}

export default function StatusDot({status}) {
    const colorClass = colorByStatus[status] || "bg-zinc-700"
    return (
        <span 
            className={`inline-block w-3 h-3 rounded-full ${colorClass}`}
            title={status}
        />
    )
}