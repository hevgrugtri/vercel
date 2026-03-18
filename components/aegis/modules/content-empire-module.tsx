"use client"

import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/aegis/glass-card"
import { cn } from "@/lib/utils"
import { 
  Clock, 
  Flame, 
  Gpu, 
  Instagram, 
  Loader2, 
  Play, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  Upload, 
  Video, 
  Youtube 
} from "lucide-react"
import { useEffect, useState } from "react"

interface ViralPeak {
  id: string
  timestamp: string
  duration: string
  engagement: number
  label: string
  status: "detected" | "clipping" | "rendering" | "uploading" | "done"
}

const initialPeaks: ViralPeak[] = [
  { id: "1", timestamp: "00:12:34", duration: "0:45", engagement: 94, label: "Funny Reaction", status: "done" },
  { id: "2", timestamp: "00:28:17", duration: "1:12", engagement: 87, label: "Epic Moment", status: "done" },
  { id: "3", timestamp: "00:45:02", duration: "0:38", engagement: 92, label: "Viewer Interaction", status: "uploading" },
  { id: "4", timestamp: "01:02:45", duration: "0:55", engagement: 89, label: "Cooking Success", status: "rendering" },
  { id: "5", timestamp: "01:18:23", duration: "0:42", engagement: 78, label: "Chat Highlight", status: "clipping" },
]

export function ContentEmpireModule() {
  const [peaks, setPeaks] = useState<ViralPeak[]>(initialPeaks)
  const [streamTime, setStreamTime] = useState("01:24:38")
  const [currentEngagement, setCurrentEngagement] = useState(72)
  
  // Simulate stream progress and new peaks
  useEffect(() => {
    const interval = setInterval(() => {
      // Update stream time
      setStreamTime(prev => {
        const [h, m, s] = prev.split(":").map(Number)
        let totalSeconds = h * 3600 + m * 60 + s + 1
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      })
      
      // Fluctuate engagement
      setCurrentEngagement(prev => Math.max(40, Math.min(100, prev + (Math.random() - 0.5) * 10)))
      
      // Progress peak statuses
      setPeaks(prev => prev.map(peak => {
        if (peak.status === "clipping" && Math.random() > 0.7) return { ...peak, status: "rendering" as const }
        if (peak.status === "rendering" && Math.random() > 0.7) return { ...peak, status: "uploading" as const }
        if (peak.status === "uploading" && Math.random() > 0.8) return { ...peak, status: "done" as const }
        return peak
      }))
      
      // Occasionally detect new peak
      if (Math.random() > 0.95) {
        const newPeak: ViralPeak = {
          id: Date.now().toString(),
          timestamp: streamTime,
          duration: `0:${Math.floor(30 + Math.random() * 45)}`,
          engagement: Math.floor(70 + Math.random() * 30),
          label: ["Viral Moment", "Chat Reaction", "Epic Play", "Funny Clip"][Math.floor(Math.random() * 4)],
          status: "detected"
        }
        setPeaks(prev => [...prev.slice(-6), newPeak])
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [streamTime])
  
  return (
    <GlassCard variant="cyan">
      <GlassCardHeader status="normal">
        <Video className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Content Empire & Clipping Farm</span>
      </GlassCardHeader>
      <GlassCardContent className="space-y-3">
        {/* Stream Timeline with Peaks */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="uppercase tracking-wider text-muted-foreground">Stream Timeline</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-status" />
              <span className="text-red-400 tabular-nums">{streamTime}</span>
            </div>
          </div>
          
          {/* Timeline bar with peaks */}
          <div className="relative h-8 bg-black/30 rounded overflow-hidden">
            {/* Timeline fill */}
            <div className="absolute inset-y-0 left-0 bg-[var(--quantum-cyan)]/20" style={{ width: "80%" }} />
            
            {/* Peak markers */}
            {peaks.map((peak, i) => (
              <div 
                key={peak.id}
                className={cn(
                  "absolute top-0 bottom-0 w-1 cursor-pointer transition-all hover:w-2",
                  peak.engagement > 90 ? "bg-[var(--constitutional-red)]" : "bg-[var(--quantum-cyan)]"
                )}
                style={{ left: `${10 + i * 12}%` }}
                title={`${peak.label} (${peak.engagement}%)`}
              >
                {peak.engagement > 85 && (
                  <Flame className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 text-orange-400" />
                )}
              </div>
            ))}
            
            {/* Playhead */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-white animate-pulse" style={{ left: "80%" }} />
            
            {/* Current engagement overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  currentEngagement > 80 ? "bg-[var(--quantum-cyan)]" : 
                  currentEngagement > 50 ? "bg-[var(--neural-violet)]" : "bg-muted"
                )}
                style={{ width: `${currentEngagement}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[9px] text-muted-foreground">
            <span>00:00:00</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[var(--quantum-cyan)]" />
              <span className="text-[var(--quantum-cyan)]">{currentEngagement.toFixed(0)}% engagement</span>
            </div>
            <span>~02:00:00</span>
          </div>
        </div>
        
        {/* Viral Peaks List */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            <Sparkles className="w-3 h-3 text-[var(--quantum-cyan)]" />
            Viral Peaks (Whisper + Gemini)
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {peaks.slice().reverse().map(peak => (
              <PeakRow key={peak.id} peak={peak} />
            ))}
          </div>
        </div>
        
        {/* Upload Queue */}
        <UploadQueue peaks={peaks.filter(p => p.status !== "done")} />
      </GlassCardContent>
    </GlassCard>
  )
}

function PeakRow({ peak }: { peak: ViralPeak }) {
  const statusConfig = {
    detected: { color: "text-[var(--quantum-cyan)]", icon: <Sparkles className="w-3 h-3" />, label: "Detected" },
    clipping: { color: "text-[var(--neural-violet)]", icon: <Loader2 className="w-3 h-3 animate-spin" />, label: "Clipping" },
    rendering: { color: "text-orange-400", icon: <Gpu className="w-3 h-3" />, label: "Rendering" },
    uploading: { color: "text-green-400", icon: <Upload className="w-3 h-3" />, label: "Uploading" },
    done: { color: "text-muted-foreground", icon: <Share2 className="w-3 h-3" />, label: "Published" }
  }
  
  const config = statusConfig[peak.status]
  
  return (
    <div className={cn(
      "flex items-center justify-between p-1.5 rounded text-[10px]",
      peak.status === "detected" ? "bg-[var(--quantum-cyan)]/10 border border-[var(--quantum-cyan)]/30" : "bg-black/20"
    )}>
      <div className="flex items-center gap-2">
        <span className="tabular-nums text-muted-foreground">{peak.timestamp}</span>
        <span className="text-foreground">{peak.label}</span>
        {peak.engagement > 90 && <Flame className="w-3 h-3 text-orange-400" />}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{peak.engagement}%</span>
        <div className={cn("flex items-center gap-1", config.color)}>
          {config.icon}
          <span className="hidden sm:inline">{config.label}</span>
        </div>
      </div>
    </div>
  )
}

function UploadQueue({ peaks }: { peaks: ViralPeak[] }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="uppercase tracking-wider text-muted-foreground">Auto-Upload Queue</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[var(--quantum-cyan)]">
            <Youtube className="w-3 h-3" />
            <span>Shorts</span>
          </div>
          <div className="flex items-center gap-1 text-pink-400">
            <Instagram className="w-3 h-3" />
            <span>Reels</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-1.5">
        {peaks.slice(0, 3).map(peak => (
          <div key={peak.id} className="glass rounded p-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-muted-foreground truncate">{peak.label}</span>
              {peak.status === "rendering" && <Gpu className="w-3 h-3 text-orange-400 animate-pulse" />}
              {peak.status === "uploading" && <Upload className="w-3 h-3 text-green-400 animate-pulse" />}
            </div>
            <div className="h-1 bg-black/30 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all",
                  peak.status === "rendering" ? "bg-orange-400" : "bg-green-400"
                )}
                style={{ 
                  width: peak.status === "rendering" ? "60%" : 
                         peak.status === "uploading" ? "85%" : "30%" 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
