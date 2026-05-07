export default function Header({domainCount, lastSync}) {
    return <p>Monitoring {domainCount} domains — last sync at {lastSync}</p>
}