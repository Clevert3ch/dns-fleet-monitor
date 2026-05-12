import formatLastSync from "../utils/formatLastSync"



export default function Header({domainCount, lastSync}) {
    

    return (
        <header className="border-b border-green-900 pb-4 mb-6">
            <h1 className="text-2xl font-bold">DNS Fleet Monitor</h1>
    <p className="text-sm text-green-600 mt-1">
        Monitoring {domainCount} {domainCount === 1 ? "domain" : "domains"} — last sync {formatLastSync(lastSync)}
    </p>
    </header>
)
}