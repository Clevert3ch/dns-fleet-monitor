



export default function Header({domainCount, lastSync}) {
    function formatLastSync(timestamp) {
        const diffMs = Date.now() - timestamp
        const seconds = Math.floor(diffMs / 1000)

        if ( seconds < 60) {
            return `${seconds}s ago`
        }
        if (seconds < 3600) {
            return `${Math.floor(seconds / 60)}m ago`
        }
        if (seconds < 86400) {
            return `${Math.floor(seconds / 3600)}h ago`
        }
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    return (
        <header className="border-b border-green-900 pb-4 mb-6">
            <h1 className="text-2xl font-bold">DNS Fleet Monitor</h1>
    <p className="text-sm text-green-600 mt-1">
        Monitoring {domainCount} {domainCount === 1 ? "domain" : "domains"} — last sync {formatLastSync(lastSync)}
    </p>
    </header>
)
}