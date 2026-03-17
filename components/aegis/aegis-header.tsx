"use client"

import { cn } from "@/lib/utils"
import { Activity, Bell, Cpu, Settings, Shield, Wifi } from "lucide-react"
import { useEffect, useState } from "react"
import { PanicButton } from "./panic-button"

interface AEGISHeaderProps {
  alignmentScore: number
  systemStatus: "nominal" | "processing" | "alert"
  onPanic: () => void
}

export function AEGISHeader({ alignmentScore, systemStatus, onPanic }: AEGISHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [uptime, setUptime] = useState("12:34:56")
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      
      // Increment uptime
      setUptime(prev => {
        const [h, m, s] = prev.split(":").map(Number)
        let totalSeconds = h * 3600 + m * 60 + s + 1
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  const statusConfig = {
    nominal: { color: "text-[var(--quantum-cyan)]", bg: "bg-[var(--quantum-cyan)]", label: "NOMINAL" },
    processing: { color: "text-[var(--neural-violet)]", bg: "bg-[var(--neural-violet)]", label: "PROCESSING" },
    alert: { color: "text-[var(--constitutional-red)]", bg: "bg-[var(--constitutional-red)]", label: "ALERT" }
  }
  
  const config = statusConfig[systemStatus]
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/30">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-md flex items-center justify-center",
              systemStatus === "alert" ? "bg-[var(--constitutional-red)]/20 glow-red" : "bg-[var(--quantum-cyan)]/20 glow-cyan"
            )}>
              <Shield className={cn(
                "w-5 h-5",
                systemStatus === "alert" ? "text-[var(--constitutional-red)]" : "text-[var(--quantum-cyan)]"
              )} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-holographic">A.E.G.I.S.</h1>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Kernel 2026</p>
            </div>
          </div>
          
          {/* System Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 glass rounded">
            <div className={cn("w-2 h-2 rounded-full animate-status", config.bg)} />
            <span className={cn("text-[10px] uppercase tracking-wider", config.color)}>{config.label}</span>
          </div>
        </div>
        
        {/* Center - Time & Uptime */}
        <div className="hidden md:flex items-center gap-6 text-[10px] font-mono">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase">UTC</span>
            <span className="text-[var(--quantum-cyan)] tabular-nums">
              {currentTime.toISOString().slice(11, 19)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground uppercase">Uptime</span>
            <span className="text-foreground tabular-nums">{uptime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground uppercase">Alignment</span>
            <span className={cn(
              "tabular-nums font-medium",
              alignmentScore > 0.7 ? "text-[var(--quantum-cyan)]" : 
              alignmentScore > 0.5 ? "text-amber-400" : "text-[var(--constitutional-red)]"
            )}>
              {(alignmentScore * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 glass rounded">
            <Wifi className="w-3 h-3 text-green-400" />
            <span className="text-[9px] text-green-400">SSE</span>
          </div>
          
          <button className="p-2 glass rounded hover:bg-white/5 relative">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--quantum-cyan)]" />
          </button>
          
          <button className="p-2 glass rounded hover:bg-white/5">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
          
          <PanicButton 
            onPanic={onPanic}
            alignmentScore={alignmentScore}
          />
        </div>
      </div>
    </header>
  )
}
