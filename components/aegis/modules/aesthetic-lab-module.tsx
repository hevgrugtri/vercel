"use client"

import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/aegis/glass-card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { 
  Brush, 
  ImagePlus, 
  Layers, 
  Loader2, 
  Mic, 
  Music, 
  Pause, 
  Play, 
  RefreshCw, 
  Settings2, 
  Sparkles, 
  Upload, 
  Volume2,
  Wand2
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

// SD XL Inpainting Console
export function InpaintingModule() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [diffusionStep, setDiffusionStep] = useState(0)
  const [totalSteps] = useState(30)
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("elegant dark fabric with subtle shimmer")
  
  const textures = [
    { id: "1", name: "Silk", color: "from-purple-900 to-indigo-900" },
    { id: "2", name: "Leather", color: "from-amber-900 to-stone-900" },
    { id: "3", name: "Velvet", color: "from-rose-900 to-purple-900" },
    { id: "4", name: "Metallic", color: "from-slate-700 to-zinc-800" },
  ]
  
  const startGeneration = useCallback(() => {
    setIsGenerating(true)
    setDiffusionStep(0)
  }, [])
  
  useEffect(() => {
    if (!isGenerating) return
    
    const interval = setInterval(() => {
      setDiffusionStep(prev => {
        if (prev >= totalSteps) {
          setIsGenerating(false)
          return totalSteps
        }
        return prev + 1
      })
    }, 100)
    
    return () => clearInterval(interval)
  }, [isGenerating, totalSteps])
  
  return (
    <GlassCard variant="violet">
      <GlassCardHeader status="processing">
        <Brush className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">SD XL Inpainting Console</span>
      </GlassCardHeader>
      <GlassCardContent className="space-y-3">
        {/* Drag & Drop Area */}
        <div className="relative border-2 border-dashed border-[var(--neural-violet)]/30 rounded-lg p-4 hover:border-[var(--neural-violet)]/50 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-[var(--neural-violet)]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-[var(--neural-violet)]" />
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="text-[var(--neural-violet)] font-medium">Drop texture</span> or click to upload
            </div>
          </div>
          
          {/* Preview overlay when generating */}
          {isGenerating && (
            <div className="absolute inset-0 bg-black/60 rounded-lg flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-[var(--neural-violet)] animate-spin mb-2" />
              <div className="text-xs text-[var(--neural-violet)]">Generating...</div>
            </div>
          )}
        </div>
        
        {/* Texture Presets */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Quick Textures</div>
          <div className="grid grid-cols-4 gap-1.5">
            {textures.map(texture => (
              <button
                key={texture.id}
                onClick={() => setSelectedTexture(texture.id)}
                className={cn(
                  "h-10 rounded bg-gradient-to-br transition-all",
                  texture.color,
                  selectedTexture === texture.id 
                    ? "ring-2 ring-[var(--neural-violet)] scale-105" 
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <span className="text-[8px] font-medium text-white/80">{texture.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Prompt Input */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Prompt</div>
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black/30 border border-[var(--neural-violet)]/30 rounded px-3 py-2 text-xs focus:outline-none focus:border-[var(--neural-violet)]"
              placeholder="Describe the texture..."
            />
            <Wand2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--neural-violet)]/50" />
          </div>
        </div>
        
        {/* Diffusion Steps Monitor */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="uppercase tracking-wider text-muted-foreground">Diffusion Steps</span>
            <span className="text-[var(--neural-violet)] tabular-nums">{diffusionStep}/{totalSteps}</span>
          </div>
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--neural-violet)] to-[var(--quantum-cyan)] transition-all duration-100"
              style={{ width: `${(diffusionStep / totalSteps) * 100}%` }}
            />
          </div>
          <DiffusionStepsViz currentStep={diffusionStep} totalSteps={totalSteps} />
        </div>
        
        {/* Generate Button */}
        <Button 
          onClick={startGeneration}
          disabled={isGenerating}
          className="w-full bg-[var(--neural-violet)] hover:bg-[var(--neural-violet)]/80 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Outfit
            </>
          )}
        </Button>
      </GlassCardContent>
    </GlassCard>
  )
}

function DiffusionStepsViz({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div 
          key={i}
          className={cn(
            "h-1 flex-1 rounded-full transition-all duration-100",
            i < currentStep 
              ? "bg-[var(--neural-violet)]" 
              : i === currentStep 
                ? "bg-[var(--neural-violet)] animate-pulse" 
                : "bg-[var(--neural-violet)]/20"
          )}
        />
      ))}
    </div>
  )
}

// Lyria RealTime & RVC Controller
export function VocalSynthesisModule() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [bpm, setBpm] = useState([85])
  const [mood, setMood] = useState([65])
  const [complexity, setComplexity] = useState([45])
  const [latency, setLatency] = useState(42)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  
  // Spectrum analyzer animation
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
    
    const bars = 32
    const barWidth = rect.width / bars
    const frequencies: number[] = Array(bars).fill(0).map(() => Math.random())
    
    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height)
      
      // Update frequencies
      for (let i = 0; i < bars; i++) {
        if (isPlaying) {
          frequencies[i] += (Math.random() - 0.5) * 0.3
          frequencies[i] = Math.max(0.1, Math.min(1, frequencies[i]))
        } else {
          frequencies[i] *= 0.95
        }
        
        const height = frequencies[i] * rect.height * 0.8
        const x = i * barWidth
        
        // Gradient
        const gradient = ctx.createLinearGradient(0, rect.height, 0, rect.height - height)
        gradient.addColorStop(0, "rgba(0, 200, 255, 0.8)")
        gradient.addColorStop(0.5, "rgba(140, 100, 255, 0.6)")
        gradient.addColorStop(1, "rgba(140, 100, 255, 0.2)")
        
        ctx.fillStyle = gradient
        ctx.fillRect(x + 1, rect.height - height, barWidth - 2, height)
        
        // Glow effect at top
        ctx.fillStyle = "rgba(0, 200, 255, 0.5)"
        ctx.fillRect(x + 1, rect.height - height - 2, barWidth - 2, 2)
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])
  
  // Fluctuate latency
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(20, Math.min(100, prev + (Math.random() - 0.5) * 20)))
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <GlassCard variant="cyan">
      <GlassCardHeader status="normal">
        <Music className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Lyria RealTime & RVC</span>
      </GlassCardHeader>
      <GlassCardContent className="space-y-3">
        {/* Spectrum Visualizer */}
        <div className="relative h-20 bg-black/50 rounded overflow-hidden border border-border/30">
          <canvas ref={canvasRef} className="w-full h-full" />
          
          {/* ASIO Badge */}
          <div className="absolute top-1 right-1 text-[8px] font-mono px-1.5 py-0.5 rounded bg-[var(--quantum-cyan)]/20 text-[var(--quantum-cyan)]">
            ASIO
          </div>
          
          {/* Latency Monitor */}
          <div className={cn(
            "absolute bottom-1 left-1 text-[9px] font-mono px-1.5 py-0.5 rounded",
            latency < 50 
              ? "bg-green-400/20 text-green-400" 
              : latency < 80 
                ? "bg-[var(--quantum-cyan)]/20 text-[var(--quantum-cyan)]"
                : "bg-[var(--constitutional-red)]/20 text-[var(--constitutional-red)]"
          )}>
            {latency.toFixed(0)}ms
          </div>
        </div>
        
        {/* Transport Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            className="h-8 w-8 rounded-full"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button 
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "h-10 w-10 rounded-full",
              isPlaying 
                ? "bg-[var(--quantum-cyan)] hover:bg-[var(--quantum-cyan)]/80 text-black" 
                : "bg-[var(--neural-violet)] hover:bg-[var(--neural-violet)]/80 text-white"
            )}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            className="h-8 w-8 rounded-full"
          >
            <Mic className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Steering Sliders */}
        <div className="space-y-3">
          <SliderControl 
            label="BPM" 
            value={bpm} 
            onChange={setBpm} 
            min={60} 
            max={140}
            displayValue={`${bpm[0]}`}
          />
          <SliderControl 
            label="Mood" 
            value={mood} 
            onChange={setMood} 
            min={0} 
            max={100}
            displayValue={mood[0] > 50 ? "Uplifting" : "Melancholic"}
          />
          <SliderControl 
            label="Complexity" 
            value={complexity} 
            onChange={setComplexity} 
            min={0} 
            max={100}
            displayValue={complexity[0] > 66 ? "Dense" : complexity[0] > 33 ? "Medium" : "Minimal"}
          />
        </div>
        
        {/* RVC Status */}
        <div className="flex items-center justify-between p-2 glass rounded">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-status" />
            <span className="text-[10px] uppercase tracking-wider">RVC Voice Clone</span>
          </div>
          <span className={cn(
            "text-[10px] font-mono tabular-nums",
            latency < 100 ? "text-green-400" : "text-[var(--constitutional-red)]"
          )}>
            Sub-100ms
          </span>
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}

function SliderControl({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  displayValue 
}: { 
  label: string
  value: number[]
  onChange: (value: number[]) => void
  min: number
  max: number
  displayValue: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="text-[var(--quantum-cyan)] tabular-nums">{displayValue}</span>
      </div>
      <Slider
        value={value}
        onValueChange={onChange}
        min={min}
        max={max}
        step={1}
        className="w-full"
      />
    </div>
  )
}
