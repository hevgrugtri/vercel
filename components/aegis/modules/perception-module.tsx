"use client"

import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/aegis/glass-card"
import { cn } from "@/lib/utils"
import { Box, Eye, Focus, Layers, MapPin, Move3d, Scan, Target } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface DetectedObject {
  id: string
  label: string
  confidence: number
  bbox: { x: number; y: number; w: number; h: number }
  attention: number
  category: "person" | "object" | "hazard" | "food"
}

const mockObjects: DetectedObject[] = [
  { id: "1", label: "Cutting Board", confidence: 0.94, bbox: { x: 30, y: 45, w: 25, h: 15 }, attention: 0.3, category: "object" },
  { id: "2", label: "Onion (browning)", confidence: 0.89, bbox: { x: 55, y: 40, w: 12, h: 12 }, attention: 0.95, category: "food" },
  { id: "3", label: "Chef Knife", confidence: 0.97, bbox: { x: 20, y: 55, w: 20, h: 8 }, attention: 0.4, category: "object" },
  { id: "4", label: "Hot Pan", confidence: 0.92, bbox: { x: 60, y: 30, w: 18, h: 18 }, attention: 0.85, category: "hazard" },
]

export function PerceptionModule() {
  const [objects, setObjects] = useState<DetectedObject[]>(mockObjects)
  const [focusPoint, setFocusPoint] = useState({ x: 55, y: 40 })
  const [heatmapIntensity, setHeatmapIntensity] = useState(0.7)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Animate focus point
  useEffect(() => {
    const interval = setInterval(() => {
      const highAttention = objects.filter(o => o.attention > 0.7)
      if (highAttention.length > 0) {
        const target = highAttention[Math.floor(Math.random() * highAttention.length)]
        setFocusPoint({
          x: target.bbox.x + target.bbox.w / 2,
          y: target.bbox.y + target.bbox.h / 2
        })
      }
      
      // Fluctuate attention
      setObjects(prev => prev.map(obj => ({
        ...obj,
        attention: Math.min(1, Math.max(0.1, obj.attention + (Math.random() - 0.5) * 0.2))
      })))
      
      setHeatmapIntensity(0.5 + Math.random() * 0.5)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [objects])
  
  // Draw attention heatmap
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    ctx.clearRect(0, 0, rect.width, rect.height)
    
    // Draw heatmap spots for each object
    objects.forEach(obj => {
      const x = (obj.bbox.x + obj.bbox.w / 2) / 100 * rect.width
      const y = (obj.bbox.y + obj.bbox.h / 2) / 100 * rect.height
      const radius = 30 + obj.attention * 40
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      const alpha = obj.attention * heatmapIntensity * 0.6
      
      if (obj.category === "hazard") {
        gradient.addColorStop(0, `rgba(255, 80, 80, ${alpha})`)
        gradient.addColorStop(0.5, `rgba(255, 80, 80, ${alpha * 0.5})`)
      } else if (obj.category === "food") {
        gradient.addColorStop(0, `rgba(0, 200, 255, ${alpha})`)
        gradient.addColorStop(0.5, `rgba(0, 200, 255, ${alpha * 0.5})`)
      } else {
        gradient.addColorStop(0, `rgba(140, 100, 255, ${alpha * 0.7})`)
        gradient.addColorStop(0.5, `rgba(140, 100, 255, ${alpha * 0.3})`)
      }
      gradient.addColorStop(1, "transparent")
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    })
    
    // Draw focus crosshair
    const fx = focusPoint.x / 100 * rect.width
    const fy = focusPoint.y / 100 * rect.height
    
    ctx.strokeStyle = "rgba(0, 200, 255, 0.8)"
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    
    ctx.beginPath()
    ctx.moveTo(fx, 0)
    ctx.lineTo(fx, rect.height)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(0, fy)
    ctx.lineTo(rect.width, fy)
    ctx.stroke()
    
    ctx.setLineDash([])
    
    // Focus ring
    ctx.strokeStyle = "rgba(0, 200, 255, 1)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(fx, fy, 15, 0, Math.PI * 2)
    ctx.stroke()
    
  }, [objects, focusPoint, heatmapIntensity])
  
  return (
    <GlassCard className="h-full" variant="cyan">
      <GlassCardHeader status="normal">
        <Eye className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">VLM Perception & Attention</span>
      </GlassCardHeader>
      <GlassCardContent className="space-y-3">
        {/* Video Feed with Heatmap Overlay */}
        <div className="relative aspect-video bg-black/50 rounded overflow-hidden border border-border/30">
          {/* Simulated video background */}
          <div className="absolute inset-0 grid-pattern-fine opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50" />
          
          {/* Heatmap canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          
          {/* Bounding boxes */}
          {objects.map(obj => (
            <BoundingBox key={obj.id} object={obj} />
          ))}
          
          {/* HUD Overlay */}
          <div className="absolute top-2 left-2 text-[9px] font-mono space-y-0.5">
            <div className="text-[var(--quantum-cyan)]">VLM: ACTIVE</div>
            <div className="text-muted-foreground">Objects: {objects.length}</div>
            <div className="text-muted-foreground">FPS: 30</div>
          </div>
          
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px]">
            <div className="w-2 h-2 rounded-full bg-[var(--quantum-cyan)] animate-status" />
            <span className="text-[var(--quantum-cyan)]">LIVE</span>
          </div>
          
          {/* Focus indicator */}
          <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[9px] text-muted-foreground">
            <Focus className="w-3 h-3 text-[var(--quantum-cyan)]" />
            <span>Focus: ({focusPoint.x.toFixed(0)}%, {focusPoint.y.toFixed(0)}%)</span>
          </div>
        </div>
        
        {/* Detected Objects List */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            <Scan className="w-3 h-3" />
            Detected Objects
          </div>
          <div className="space-y-1 max-h-28 overflow-y-auto">
            {objects.sort((a, b) => b.attention - a.attention).map(obj => (
              <ObjectRow key={obj.id} object={obj} />
            ))}
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}

function BoundingBox({ object }: { object: DetectedObject }) {
  const categoryColors = {
    person: "border-[var(--neural-violet)] text-[var(--neural-violet)]",
    object: "border-[var(--quantum-cyan)]/60 text-[var(--quantum-cyan)]",
    hazard: "border-[var(--constitutional-red)] text-[var(--constitutional-red)]",
    food: "border-green-400 text-green-400"
  }
  
  return (
    <div 
      className={cn(
        "absolute border rounded transition-all duration-500",
        categoryColors[object.category],
        object.attention > 0.8 && "animate-pulse-cyan"
      )}
      style={{
        left: `${object.bbox.x}%`,
        top: `${object.bbox.y}%`,
        width: `${object.bbox.w}%`,
        height: `${object.bbox.h}%`,
        borderWidth: object.attention > 0.7 ? 2 : 1,
        opacity: 0.4 + object.attention * 0.6
      }}
    >
      <div className={cn(
        "absolute -top-4 left-0 text-[8px] font-mono whitespace-nowrap px-1 rounded-t",
        "bg-black/60"
      )}>
        {object.label} {(object.confidence * 100).toFixed(0)}%
      </div>
    </div>
  )
}

function ObjectRow({ object }: { object: DetectedObject }) {
  const categoryColors = {
    person: "bg-[var(--neural-violet)]/20 border-[var(--neural-violet)]/30",
    object: "bg-[var(--quantum-cyan)]/10 border-[var(--quantum-cyan)]/20",
    hazard: "bg-[var(--constitutional-red)]/20 border-[var(--constitutional-red)]/30",
    food: "bg-green-400/10 border-green-400/20"
  }
  
  const categoryIcons = {
    person: "P",
    object: "O",
    hazard: "!",
    food: "F"
  }
  
  return (
    <div className={cn(
      "flex items-center justify-between text-[10px] p-1.5 rounded border",
      categoryColors[object.category]
    )}>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 flex items-center justify-center rounded text-[8px] font-bold bg-black/30">
          {categoryIcons[object.category]}
        </span>
        <span>{object.label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{(object.confidence * 100).toFixed(0)}%</span>
        <div className="w-16 h-1.5 bg-black/30 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              object.attention > 0.8 ? "bg-[var(--quantum-cyan)]" : "bg-[var(--quantum-cyan)]/50"
            )}
            style={{ width: `${object.attention * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// 3D Occlusion & NavMesh Module
export function OcclusionModule() {
  const [occlusionData, setOcclusionData] = useState({
    distance: 2.4,
    occluded: false,
    navMeshNodes: 12,
    pathClear: true
  })
  
  useEffect(() => {
    const interval = setInterval(() => {
      setOcclusionData({
        distance: 1.5 + Math.random() * 3,
        occluded: Math.random() > 0.7,
        navMeshNodes: Math.floor(8 + Math.random() * 10),
        pathClear: Math.random() > 0.3
      })
    }, 2500)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <GlassCard variant={occlusionData.occluded ? "violet" : "cyan"}>
      <GlassCardHeader status={occlusionData.occluded ? "processing" : "normal"}>
        <Move3d className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">3D Occlusion & NavMesh</span>
      </GlassCardHeader>
      <GlassCardContent className="space-y-3">
        {/* 3D Space Visualization */}
        <div className="relative h-32 bg-black/50 rounded overflow-hidden border border-border/30">
          <NavMeshVisualization occlusionData={occlusionData} />
          
          {/* Status overlay */}
          <div className="absolute top-2 left-2 space-y-1">
            <div className={cn(
              "text-[9px] font-mono px-1.5 py-0.5 rounded",
              occlusionData.occluded 
                ? "bg-[var(--neural-violet)]/30 text-[var(--neural-violet)]" 
                : "bg-[var(--quantum-cyan)]/20 text-[var(--quantum-cyan)]"
            )}>
              {occlusionData.occluded ? "OCCLUDED" : "VISIBLE"}
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2 text-[9px] font-mono text-muted-foreground">
            LiDAR/NSDK Active
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          <MetricBox 
            icon={<Target className="w-3 h-3" />}
            label="Distance"
            value={`${occlusionData.distance.toFixed(1)}m`}
            status={occlusionData.distance < 2 ? "alert" : "normal"}
          />
          <MetricBox 
            icon={<Layers className="w-3 h-3" />}
            label="NavMesh Nodes"
            value={occlusionData.navMeshNodes.toString()}
            status="normal"
          />
          <MetricBox 
            icon={<Box className="w-3 h-3" />}
            label="Occlusion"
            value={occlusionData.occluded ? "YES" : "NO"}
            status={occlusionData.occluded ? "processing" : "normal"}
          />
          <MetricBox 
            icon={<MapPin className="w-3 h-3" />}
            label="Path"
            value={occlusionData.pathClear ? "CLEAR" : "BLOCKED"}
            status={occlusionData.pathClear ? "normal" : "alert"}
          />
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}

function NavMeshVisualization({ occlusionData }: { occlusionData: { navMeshNodes: number; occluded: boolean; pathClear: boolean } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    ctx.clearRect(0, 0, rect.width, rect.height)
    
    // Draw perspective grid
    ctx.strokeStyle = "rgba(0, 200, 255, 0.15)"
    ctx.lineWidth = 0.5
    
    const horizon = rect.height * 0.3
    const vanishingPoint = { x: rect.width / 2, y: horizon }
    
    // Horizontal lines
    for (let i = 0; i < 8; i++) {
      const y = horizon + (rect.height - horizon) * (i / 7)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(rect.width, y)
      ctx.stroke()
    }
    
    // Perspective lines
    for (let i = 0; i < 7; i++) {
      const x = (i / 6) * rect.width
      ctx.beginPath()
      ctx.moveTo(x, rect.height)
      ctx.lineTo(vanishingPoint.x, vanishingPoint.y)
      ctx.stroke()
    }
    
    // Draw NavMesh nodes
    const nodePositions: { x: number; y: number }[] = []
    for (let i = 0; i < occlusionData.navMeshNodes; i++) {
      const x = 20 + Math.random() * (rect.width - 40)
      const y = horizon + 20 + Math.random() * (rect.height - horizon - 30)
      nodePositions.push({ x, y })
      
      ctx.fillStyle = occlusionData.pathClear 
        ? "rgba(0, 200, 255, 0.6)" 
        : "rgba(140, 100, 255, 0.6)"
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Connect nearby nodes
    ctx.strokeStyle = occlusionData.pathClear 
      ? "rgba(0, 200, 255, 0.2)" 
      : "rgba(140, 100, 255, 0.2)"
    ctx.lineWidth = 1
    
    nodePositions.forEach((node, i) => {
      nodePositions.slice(i + 1).forEach(other => {
        const dist = Math.hypot(node.x - other.x, node.y - other.y)
        if (dist < 60) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        }
      })
    })
    
    // Draw VRM avatar position
    const avatarX = rect.width / 2
    const avatarY = rect.height * 0.7
    
    ctx.fillStyle = occlusionData.occluded 
      ? "rgba(140, 100, 255, 0.8)" 
      : "rgba(0, 200, 255, 0.8)"
    ctx.beginPath()
    ctx.arc(avatarX, avatarY, 8, 0, Math.PI * 2)
    ctx.fill()
    
    // Avatar label
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = "8px monospace"
    ctx.textAlign = "center"
    ctx.fillText("VRM", avatarX, avatarY + 18)
    
    // Occlusion indicator
    if (occlusionData.occluded) {
      ctx.fillStyle = "rgba(140, 100, 255, 0.3)"
      ctx.fillRect(avatarX - 30, avatarY - 40, 60, 35)
      ctx.strokeStyle = "rgba(140, 100, 255, 0.8)"
      ctx.lineWidth = 2
      ctx.strokeRect(avatarX - 30, avatarY - 40, 60, 35)
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
      ctx.fillText("OBSTACLE", avatarX, avatarY - 20)
    }
    
  }, [occlusionData])
  
  return <canvas ref={canvasRef} className="w-full h-full" />
}

function MetricBox({ 
  icon, 
  label, 
  value, 
  status 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  status: "normal" | "processing" | "alert"
}) {
  const statusColors = {
    normal: "border-[var(--quantum-cyan)]/30 text-[var(--quantum-cyan)]",
    processing: "border-[var(--neural-violet)]/30 text-[var(--neural-violet)]",
    alert: "border-[var(--constitutional-red)]/30 text-[var(--constitutional-red)]"
  }
  
  return (
    <div className={cn("glass rounded p-2 border", statusColors[status])}>
      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      <div className="text-sm font-bold tabular-nums">{value}</div>
    </div>
  )
}
