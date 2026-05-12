export default function StatCard({label, value}) {
    return (
        <div className="bg-zinc-900 border border-green-900 rounded-lg p-4">
                <div className="text-2xl font-bold">{label}</div>
                <div className="text-s text-green-700 uppercase tracking-wider mt-1">{value}</div>
         </div>
        )
}