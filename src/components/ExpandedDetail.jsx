
import StatusDot from "./StatusDot"

const checkLabels = {
        a: "A Record",
        mx: "MX Records",
        spf: "SPF",
        dnssec: "DNSSEC",
}

export default function ExpandedDetail({domain}) {
    return (
    <div className="grid grid-cols-[120px_1fr] gap-x-6 gap-y-4 text-sm">
            {Object.entries(domain.checks).map(([key, check]) => (
                <div key={key} className="contents">
                    <div className="text-green-700 uppercase tracking-wider">
                        {checkLabels[key]}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <StatusDot status={check.status} />
                            <span className="text-green-600 text-xs">{check.status}</span>
                        </div>
                        {check.values.length > 0 ? (
                            check.values.map((value, i) => (
                                <div key={i} className="text-green-400">{value}</div>
                            ))
                        ) : (
                            <div className="text-green-800 italic">no records</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}