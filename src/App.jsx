import {useEffect, useState} from "react"
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import AddDomainBar from "./components/AddDomainBar";
import Table from "./components/Table";

function getDomainStatus(domain){
    const statuses = [
      domain.checks.a.status,
      domain.checks.mx.status,
      domain.checks.spf.status,
      domain.checks.dnssec.status,
    ]

    
    if (statuses.includes("fail")) {
      return "failing"
    }
    if(statuses.includes("warning")){
      return "warning"
    }
    if(statuses.includes("pending")) {
      return "loading"
    }
    return "healthy"
  }
async function dnsQuery(domain, type) {
  const res = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`)
  const data = await res.json()
  return data
  
}


async function lookupA(domain) {
   const data = await dnsQuery(domain, "A")
   
   if (data.Status !== 0 || !data.Answer) {
    return {
      status: "fail",
      values: [],
    }
   }
   return {
    status: "ok",
    values: data.Answer.map(a => a.data),
   }
}

async function lookupMX(domain) {
  const data = await dnsQuery(domain, "MX")

  if (data.Status !== 0 || !data.Answer) {
    return {
      status: "fail",
      values: [],
    }
   }
   return {
    status: "ok",
    values: data.Answer.map(mx => mx.data),
   }
}

async function lookupSPF(domain) {
  const data = await dnsQuery(domain, "TXT")

  if (data.Status !== 0 || !data.Answer) {
    return {
      status: "fail",
      values: [],
    }
   }
const values = data.Answer
.map(record => record.data.replace(/^"|"$/g, ""))
.filter(txt => txt.startsWith("v=spf"))

if (values.length === 0) {
  return {
    status: "fail",
    values: [],
  }
}
   return {
    status: "ok",
    values,
   }
}

async function lookupDNSSEC(domain) {
  const data = await dnsQuery(domain, "A")

  if(data.AD === true) {
    return {
      status: "ok",
      values: ["DNSSEC validated"],
    }
  }
  return {
    status: "warning",
    values: ["No DNSSEC"],
  }

}






function App() {

  const defaultSeedDomains = [
  {
    id: "1",
    name: "google.com",
    checks: {
      a:      { status: "pending", values: [] },
      mx:     { status: "pending", values: [] },
      spf:    { status: "pending", values: [] },
      dnssec: { status: "pending", values: [] },
    },
    latency: 0,
    lastChecked: Date.now(),
  }
]

 const [domains, setDomains] = useState(() => {
  try {
     const saved = localStorage.getItem("domains")
     if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error("Failed to load domains from localStorage:", e)
  }
  return defaultSeedDomains
 })

 useEffect(() => {
  localStorage.setItem("domains", JSON.stringify(domains))
 }, [domains])
  

        useEffect(() => {
          domains.forEach(domain => {
            if(getDomainStatus(domain) !== "loading") return

            const start = Date.now()
              
            Promise.all([
              lookupA(domain.name),
              lookupMX(domain.name),
              lookupSPF(domain.name),
              lookupDNSSEC(domain.name),
              ]).then(([a, mx, spf, dnssec]) => {
                const latency = Date.now() - start
              setDomains(prev => prev.map(d => 
                d.id === domain.id 
                  ? { ...d, checks: { a, mx, spf, dnssec },
                  latency,
                  lastChecked: Date.now()
                  }
                  : d
              ))
              })
                  
                })
              }, [domains])

            useEffect(() => {
              const id = setInterval(() => {
                setDomains(prev => prev.map(d => ({
                    ...d,
                checks: {
                  a:      { ...d.checks.a,      status: "pending" },
                  mx:     { ...d.checks.mx,     status: "pending" },
                  spf:    { ...d.checks.spf,    status: "pending" },
                  dnssec: { ...d.checks.dnssec, status: "pending" },
                  }

                })))
              }, 30000) 
              return () => clearInterval(id) 
            }, [])

  const domainCount = domains.length
  const lastSync = Math.max(...domains.map(d => d.lastChecked))

  const healthyCount = domains.filter(d => getDomainStatus(d) === "healthy").length

  const warningCount = domains.filter( d => getDomainStatus(d) === "warning").length

  const failingCount = domains.filter( d => getDomainStatus(d) === "failing").length

  let totalLatency = 0 
  for (const domain of domains) {
    totalLatency += domain.latency
  }

  const avgLatency = 
  domains.length > 0
  ? totalLatency / domains.length
  : 0

  
  function handleAddDomain(domainName){
    const trimmedName = domainName.trim()

    if (trimmedName === "") {
      return
    }

    if (domains.some(d => d.name === trimmedName)) {
      return
    }

    const newDomain = {
      id: crypto.randomUUID(),
      name: trimmedName,
      checks: {
        a: { status: "pending", values: [] },
        mx: { status: "pending", values: [] },
        spf: { status: "pending", values: [] },
        dnssec: { status: "pending", values: [] },
      },
      latency: 0,
      lastChecked: Date.now(),
    }
   
    setDomains([...domains, newDomain])
  }
 
 
  function handleDeleteDomain(id) {
    setDomains(domains.filter(d => d.id !== id))
  }

  function handleRefreshAll(){
    setDomains(prev => prev.map(d => ({
        ...d,
    checks: {
      a:      { ...d.checks.a,      status: "pending" },
      mx:     { ...d.checks.mx,     status: "pending" },
      spf:    { ...d.checks.spf,    status: "pending" },
      dnssec: { ...d.checks.dnssec, status: "pending" },
    }
    })))
  }

  
  
  return (
    <div className="bg-zinc-950 text-green-400 font-mono min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
    
        <Header 
        domainCount={domainCount}
        lastSync={lastSync}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 " >
        <StatCard label="Healthy" value={healthyCount} />
        <StatCard label="Warnings" value={warningCount} />
        <StatCard label="Failing" value={failingCount} />
        <StatCard label="Avg latency" value={`${Math.round(avgLatency)}ms`} />
        </div>
        <AddDomainBar
        onAddDomain={handleAddDomain}
        onRefreshAll={handleRefreshAll}
        />
        <Table 
        domains={domains}
        onDeleteDomain={handleDeleteDomain}
        />
      </div>
    </div>
  )
  
}

export default App
