"use client"

import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/aegis/glass-card"
import { cn } from "@/lib/utils"
import { 
  Activity, 
  Battery, 
  Bluetooth, 
  Brain, 
  Heart, 
  Thermometer, 
  TrendingDown, 
  TrendingUp, 
  Watch, 
  Zap 
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface BiometricData {
  heartRate: number
  hrv: number
  stress: number
  bodyBattery: number
  temperature: number
  steps: number
}

export function BiometricModule() {
  const [data, setData] = useState<BiometricData>({
    heartRate: 72,
    hrv: 45,
    stress: 35,
    bodyBattery: 67,
    temperature: 36.8,
    steps: 4287
  })
  const [aiMood, setAiMood] = useState<"calm" | "energetic" | "supportive">("calm")
  const [connected, setConnected] = useState(true)
  const heartCanvasRef = useRef<HTMLCanvasElement>(null)
  
  // Simulate biometric data stream
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newStress = Math.max(10, Math.min(90, prev.stress + (Math.random() - 0.5) * 15))
        const newHr = Math.max(55, Math.min(120, prev.heartRate + (Math.random() - 0.5) * 8))
        
        // AI adapts to user state
        if (newStress > 60) {
          setAiMood("supportive")
        } else if (newHr > 90) {
          setAiMood("energetic")
        } else {
          setAiMood("calm")
        }
        
        return {
          heartRate: Math.round(newHr),
          hrv: Math.max(20, Math.min(80, prev.hrv + (Math.random() - 0.5) * 10)),
          stress: Math.round(newStress),
          bodyBattery: Math.max(5, Math.min(100, prev.bodyBattery + (Math.random() - 0.5) * 3)),
          temperature: Math.round((36.5 + Math.random() * 0.8) * 10) / 10,
          steps: prev.steps + Math.floor(Math.random() * 10)
        }
      })
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Heart rate ECG animation
  useEffect(() => {
    const canvas = heartCanvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    let offset = 0
    
    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height)
      
      // Draw ECG line
      ctx.strokeStyle = "rgba(0, 200, 255, 0.8)"
      ctx.lineWidth = 2
      ctx.beginPath()
      
      const baseY = rect.height / 2
      const amplitude = rect.height * 0.35
      
      for (let x = 0; x < rect.width; x++) {
        const progress = (x + offset) % rect.width
        const normalizedX = progress / rect.width
        
        let y = baseY
        
        // ECG waveform simulation
        if (normalizedX > 0.1 && normalizedX < 0.15) {
          // P wave
          y = baseY - Math.sin((normalizedX - 0.1) * Math.PI / 0.05) * amplitude * 0.2
        } else if (normalizedX > 0.2 && normalizedX < 0.22) {
          // Q wave
          y = baseY + amplitude * 0.1
        } else if (normalizedX > 0.22 && normalizedX < 0.28) {
          // R wave (peak)
          y = baseY - Math.sin((normalizedX - 0.22) * Math.PI / 0.06) * amplitude
        } else if (normalizedX > 0.28 && normalizedX < 0.32) {
          // S wave
          y = baseY + amplitude * 0.15
        } else if (normalizedX > 0.35 && normalizedX < 0.5) {
          // T wave
          y = baseY - Math.sin((normalizedX - 0.35) * Math.PI / 0.15) * amplitude * 0.3
        }
        
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.stroke()
      
      // Glow effect
      ctx.strokeStyle = "rgba(0, 200, 255, 0.2)"
      ctx.lineWidth = 6
      ctx.stroke()
      
      offset += 2
      requestAnimationFrame(animate)
    }
    
    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])
  
  const moodConfig = {
    calm: { color: "text-[var(--quantum-cyan)]", label: "Calm & Focused", icon: <Brain className="w-3 h-3" /> },
    energetic: { color: "text-[var(--neural-violet)]", label: "High Energy", icon: <Zap className="w-3 h-3" /> },
    supportive: { color: "text-green-400", label: "Supportive Mode", icon: <Heart className="w-3 h-3" /> }
  }
  
  return (
    <GlassCard variant={data.stress > 60 ? "violet" : "cyan"}>
      <GlassCardHeader status={data.stress > 60 ? "processing" : "normal"}>
        <Watch className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Biometric Symbiosis</span>
      </GlassCardHeader>
      <GlassCardContent className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2">
            <Bluetooth className={cn("w-3 h-3", connected ? "text-[var(--quantum-cyan)]" : "text-muted-foreground")} />
            <span className={connected ? "text-[var(--quantum-cyan)]" : "text-muted-foreground"}>
              {connected ? "Garmin/ESP32 Connected" : "Disconnected"}
            </span>
          </div>
          <div className={cn("flex items-center gap-1", moodConfig[aiMood].color)}>
            {moodConfig[aiMood].icon}
            <span>{moodConfig[aiMood].label}</span>
          </div>
        </div>
        
        {/* Heart Rate ECG */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Heart className="w-3 h-3 text-red-400" />
              Heart Rate
            </div>
            <span className="text-lg font-bold text-red-400 tabular-nums">{data.heartRate} <span className="text-xs font-normal">BPM</span></span>
          </div>
          <div className="h-12 bg-black/30 rounded overflow-hidden border border-red-400/20">
            <canvas ref={heartCanvasRef} className="w-full h-full" />
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          <BiometricCard 
            icon={<Activity className="w-3 h-3" />}
            label="HRV"
            value={`${data.hrv}ms`}
            trend={data.hrv > 40 ? "up" : "down"}
            color={data.hrv > 40 ? "cyan" : "amber"}
          />
          <BiometricCard 
            icon={<Brain className="w-3 h-3" />}
            label="Stress"
            value={`${data.stress}%`}
            trend={data.stress < 50 ? "down" : "up"}
            color={data.stress < 50 ? "cyan" : data.stress < 70 ? "amber" : "red"}
          />
          <BiometricCard 
            icon={<Battery className="w-3 h-3" />}
            label="Body Battery"
            value={`${data.bodyBattery}%`}
            trend={data.bodyBattery > 50 ? "up" : "down"}
            color={data.bodyBattery > 50 ? "cyan" : "amber"}
          />
          <BiometricCard 
            icon={<Thermometer className="w-3 h-3" />}
            label="Temperature"
            value={`${data.temperature}°C`}
            trend="neutral"
            color="cyan"
          />
        </div>
        
        {/* AI Adaptation Status */}
        <div className="p-2 glass rounded space-y-1">
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">AI Adaptation</div>
          <div className="text-[10px]">
            {data.stress > 60 ? (
              <span className="text-green-400">Detected elevated stress. AI is adapting tone to be more supportive and calming.</span>
            ) : data.heartRate > 90 ? (
              <span className="text-[var(--neural-violet)]">High energy detected. AI matching enthusiasm with dynamic responses.</span>
            ) : (
              <span className="text-[var(--quantum-cyan)]">Nominal state. AI maintaining calm, focused interaction style.</span>
            )}
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}

function BiometricCard({ 
  icon, 
  label, 
  value, 
  trend, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  trend: "up" | "down" | "neutral"
  color: "cyan" | "amber" | "red"
}) {
  const colorClasses = {
    cyan: "border-[var(--quantum-cyan)]/30 text-[var(--quantum-cyan)]",
    amber: "border-amber-400/30 text-amber-400",
    red: "border-[var(--constitutional-red)]/30 text-[var(--constitutional-red)]"
  }
  
  return (
    <div className={cn("glass rounded p-2 border", colorClasses[color])}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
          {icon}
          {label}
        </div>
        {trend === "up" && <TrendingUp className="w-3 h-3 text-green-400" />}
        {trend === "down" && <TrendingDown className="w-3 h-3 text-red-400" />}
      </div>
      <div className="text-sm font-bold tabular-nums">{value}</div>
    </div>
  )
}
