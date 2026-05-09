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

 
  const [domains, setDomains] = useState([
    {
    id: "1",
    name: "google.com",
    checks: {
      a: { status: "ok", values: ["108.177.14.139"] },
      mx: { status: "ok", values: ["smtp.google.com"] },
      spf: { status: "warning", values: ["v=spf1 include:_spf.google.com ~all"] },
      dnssec: { status: "fail", values: [] }
    },
    latency: 22,
    lastChecked: Date.now(),
  },
  {
    id: "2",
    name: "nrk.no",
    checks: {
      a: { status: "ok", values: ["92.123.135.148"] },
      mx: { status: "ok", values: ["smtp.google.com"] },
      spf: {
        status: "ok",
        values: [
          "v=spf1 mx a ip4:160.67.135.178 ip4:160.67.166.179 ip4:77.94.235.18 ip4:23.253.183.25 ip4:77.94.238.194 a:msg-out.onevoice.no include:spf.protection.outlook.com include:_spf.anpdm.com include:_spf.sndr.no include:_spf.google.com -all"
        ]
      },
      dnssec: { status: "ok", values: [] },
    },
    latency: 24,
    lastChecked: Date.now() - 15000,
  },
  {
    id: "3",
    name: "vg.no",
    checks: {
      a: { status: "ok", values: ["13.33.235.87"] },
      mx: {
        status: "ok",
        values: ["alt1.aspmx.l.google.com", "alt3.aspmx.l.google.com"]
      },
      spf: { status: "ok", values: ["v=spf1 include:_u.vg.no._spf.smart.ondmarc.com ~all"] },
      dnssec: { status: "warning", values: [] },
    },
    latency: 32,
    lastChecked: Date.now() - 60000,
  }
  ])

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

  
  
  return (
    <>
    <Header 
    domainCount={domainCount}
    lastSync={lastSync}
    />
    <StatCard label="Healthy" value={healthyCount} />
    <StatCard label="Warnings" value={warningCount} />
    <StatCard label="Failing" value={failingCount} />
    <StatCard label="Avg latency" value={avgLatency} />
    <AddDomainBar
    onAddDomain={handleAddDomain}
    />
    <Table 
    domains={domains}
    onDeleteDomain={handleDeleteDomain}
     />
    
    </>
  )
  
}

export default App
