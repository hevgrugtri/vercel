"use client"

import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/aegis/glass-card"
import { cn } from "@/lib/utils"
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Coins, 
  Cpu, 
  DollarSign, 
  Fuel, 
  Gpu, 
  Server, 
  TrendingUp, 
  Wallet,
  Zap
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface GPUNode {
  id: string
  name: string
  type: "RTX 4090" | "A100" | "H100"
  provider: "io.net" | "Render"
  costPerHour: number
  utilization: number
  status: "active" | "idle" | "offline"
}

const gpuNodes: GPUNode[] = [
  { id: "1", name: "Node-Alpha", type: "RTX 4090", provider: "io.net", costPerHour: 0.32, utilization: 87, status: "active" },
  { id: "2", name: "Node-Beta", type: "A100", provider: "Render", costPerHour: 1.24, utilization: 94, status: "active" },
  { id: "3", name: "Node-Gamma", type: "RTX 4090", provider: "io.net", costPerHour: 0.28, utilization: 45, status: "idle" },
  { id: "4", name: "Node-Delta", type: "H100", provider: "Render", costPerHour: 2.10, utilization: 0, status: "offline" },
]

export function DePINModule() {
  const [nodes, setNodes] = useState<GPUNode[]>(gpuNodes)
  const [economics, setEconomics] = useState({
    totalCostPerHour: 4.94,
    donationsPerHour: 12.50,
    roi: 153,
    totalSpent24h: 118.56,
    totalEarned24h: 300.00
  })
  const chartRef = useRef<HTMLCanvasElement>(null)
  
  // Fluctuate economics
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        utilization: node.status === "offline" ? 0 : 
                     Math.max(10, Math.min(100, node.utilization + (Math.random() - 0.5) * 15)),
        status: node.status === "offline" ? "offline" : 
                Math.random() > 0.95 ? "idle" : "active"
      })))
      
      setEconomics(prev => {
        const newDonations = Math.max(5, prev.donationsPerHour + (Math.random() - 0.5) * 3)
        const newCost = Math.max(2, prev.totalCostPerHour + (Math.random() - 0.5) * 0.5)
        return {
          ...prev,
          donationsPerHour: Math.round(newDonations * 100) / 100,
          totalCostPerHour: Math.round(newCost * 100) / 100,
          roi: Math.round((newDonations / newCost) * 100)
        }
      })
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Draw cost chart
  useEffect(() => {
    const canvas = chartRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    ctx.clearRect(0, 0, rect.width, rect.height)
    
    // Generate cost data points
    const costData: number[] = []
    const revenueData: number[] = []
    for (let i = 0; i < 24; i++) {
      costData.push(3 + Math.random() * 3)
      revenueData.push(8 + Math.random() * 8)
    }
    
    const maxValue = Math.max(...costData, ...revenueData)
    const xStep = rect.width / (costData.length - 1)
    
    // Draw revenue area
    ctx.fillStyle = "rgba(0, 200, 255, 0.1)"
    ctx.beginPath()
    ctx.moveTo(0, rect.height)
    revenueData.forEach((value, i) => {
      const x = i * xStep
      const y = rect.height - (value / maxValue) * rect.height * 0.9
      ctx.lineTo(x, y)
    })
    ctx.lineTo(rect.width, rect.height)
    ctx.closePath()
    ctx.fill()
    
    // Draw revenue line
    ctx.strokeStyle = "rgba(0, 200, 255, 0.8)"
    ctx.lineWidth = 2
    ctx.beginPath()
    revenueData.forEach((value, i) => {
      const x = i * xStep
      const y = rect.height - (value / maxValue) * rect.height * 0.9
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
    
    // Draw cost area
    ctx.fillStyle = "rgba(255, 100, 100, 0.1)"
    ctx.beginPath()
    ctx.moveTo(0, rect.height)
    costData.forEach((value, i) => {
      const x = i * xStep
      const y = rect.height - (value / maxValue) * rect.height * 0.9
      ctx.lineTo(x, y)
    })
    ctx.lineTo(rect.width, rect.height)
    ctx.closePath()
    ctx.fill()
    
    // Draw cost line
    ctx.strokeStyle = "rgba(255, 100, 100, 0.8)"
    ctx.lineWidth = 2
    ctx.beginPath()
    costData.forEach((value, i) => {
      const x = i * xStep
      const y = rect.height - (value / maxValue) * rect.height * 0.9
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
    
  }, [economics])
  
  const activeNodes = nodes.filter(n => n.status === "active").length
  
  return (
    <GlassCard variant={economics.roi > 100 ? "cyan" : "red"}>
      <GlassCardHeader status={economics.roi > 100 ? "normal" : "alert"}>
        <Gpu className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">GPU Tokenomics (DePIN)</span>
      </GlassCardHeader>
      <GlassCardContent className="space-y-3">
        {/* ROI Banner */}
        <div className={cn(
          "flex items-center justify-between p-2 rounded",
          economics.roi > 100 
            ? "bg-green-400/10 border border-green-400/30" 
            : "bg-[var(--constitutional-red)]/10 border border-[var(--constitutional-red)]/30"
        )}>
          <div className="flex items-center gap-2">
            <TrendingUp className={cn("w-4 h-4", economics.roi > 100 ? "text-green-400" : "text-[var(--constitutional-red)]")} />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Stream ROI</span>
          </div>
          <span className={cn(
            "text-lg font-bold tabular-nums",
            economics.roi > 100 ? "text-green-400" : "text-[var(--constitutional-red)]"
          )}>
            {economics.roi}%
          </span>
        </div>
        
        {/* Cost vs Revenue Chart */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="uppercase tracking-wider text-muted-foreground">24h Cost vs Revenue</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[var(--constitutional-red)]" />
                <span className="text-[var(--constitutional-red)]">Cost</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[var(--quantum-cyan)]" />
                <span className="text-[var(--quantum-cyan)]">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-16 bg-black/30 rounded overflow-hidden border border-border/30">
            <canvas ref={chartRef} className="w-full h-full" />
          </div>
        </div>
        
        {/* Economics Grid */}
        <div className="grid grid-cols-2 gap-2">
          <EconCard 
            icon={<Fuel className="w-3 h-3" />}
            label="Cost/Hour"
            value={`$${economics.totalCostPerHour.toFixed(2)}`}
            trend="down"
            good={true}
          />
          <EconCard 
            icon={<Coins className="w-3 h-3" />}
            label="Donations/Hour"
            value={`$${economics.donationsPerHour.toFixed(2)}`}
            trend="up"
            good={true}
          />
          <EconCard 
            icon={<ArrowDownRight className="w-3 h-3" />}
            label="Spent (24h)"
            value={`$${economics.totalSpent24h.toFixed(2)}`}
            trend="neutral"
            good={false}
          />
          <EconCard 
            icon={<ArrowUpRight className="w-3 h-3" />}
            label="Earned (24h)"
            value={`$${economics.totalEarned24h.toFixed(2)}`}
            trend="up"
            good={true}
          />
        </div>
        
        {/* GPU Nodes */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="uppercase tracking-wider text-muted-foreground">Decentralized GPU Nodes</span>
            <span className="text-[var(--quantum-cyan)]">{activeNodes}/{nodes.length} active</span>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {nodes.map(node => (
              <GPUNodeRow key={node.id} node={node} />
            ))}
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}

function EconCard({ 
  icon, 
  label, 
  value, 
  trend, 
  good 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  trend: "up" | "down" | "neutral"
  good: boolean
}) {
  return (
    <div className={cn(
      "glass rounded p-2 border",
      good ? "border-[var(--quantum-cyan)]/20" : "border-[var(--constitutional-red)]/20"
    )}>
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-sm font-bold tabular-nums",
          good ? "text-[var(--quantum-cyan)]" : "text-[var(--constitutional-red)]"
        )}>{value}</span>
        {trend === "up" && <ArrowUpRight className="w-3 h-3 text-green-400" />}
        {trend === "down" && <ArrowDownRight className="w-3 h-3 text-green-400" />}
      </div>
    </div>
  )
}

function GPUNodeRow({ node }: { node: GPUNode }) {
  const statusColors = {
    active: "bg-green-400",
    idle: "bg-amber-400",
    offline: "bg-[var(--constitutional-red)]"
  }
  
  const providerColors = {
    "io.net": "text-[var(--quantum-cyan)]",
    "Render": "text-[var(--neural-violet)]"
  }
  
  return (
    <div className="flex items-center justify-between p-1.5 bg-black/20 rounded text-[10px]">
      <div className="flex items-center gap-2">
        <div className={cn("w-1.5 h-1.5 rounded-full", statusColors[node.status])} />
        <Cpu className="w-3 h-3 text-muted-foreground" />
        <span>{node.name}</span>
        <span className="text-muted-foreground">{node.type}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={providerColors[node.provider]}>{node.provider}</span>
        <span className="text-muted-foreground w-8 text-right">{node.utilization}%</span>
        <span className="text-amber-400 w-12 text-right">${node.costPerHour.toFixed(2)}/h</span>
      </div>
    </div>
  )
}
