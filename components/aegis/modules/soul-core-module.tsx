"use client"

import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/aegis/glass-card"
import { cn } from "@/lib/utils"
import { Brain, Heart, Lightbulb, MessageSquare, Sparkles, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface ThoughtEntry {
  id: string
  type: "reasoning" | "monologue" | "output"
  content: string
  timestamp: number
  alignment: { empathy: number; kindness: number }
}

const initialThoughts: ThoughtEntry[] = [
  { id: "1", type: "reasoning", content: "Analyzing user emotional state from text patterns...", timestamp: Date.now() - 5000, alignment: { empathy: 0.85, kindness: 0.9 } },
  { id: "2", type: "monologue", content: "They seem stressed. I should be more supportive in my response.", timestamp: Date.now() - 4500, alignment: { empathy: 0.92, kindness: 0.88 } },
  { id: "3", type: "output", content: "I understand this can be overwhelming. Let me help break it down step by step.", timestamp: Date.now() - 4000, alignment: { empathy: 0.95, kindness: 0.95 } },
  { id: "4", type: "reasoning", content: "Processing context window: 12,847 tokens. Relevance score: 0.94", timestamp: Date.now() - 3000, alignment: { empathy: 0.8, kindness: 0.85 } },
  { id: "5", type: "monologue", content: "This topic requires careful handling. Checking constitutional bounds...", timestamp: Date.now() - 2500, alignment: { empathy: 0.88, kindness: 0.92 } },
  { id: "6", type: "output", content: "Based on the context you've provided, here are three approaches we could consider...", timestamp: Date.now() - 2000, alignment: { empathy: 0.9, kindness: 0.93 } },
]

export function SoulCoreModule() {
  const [thoughts, setThoughts] = useState<ThoughtEntry[]>(initialThoughts)
  const [sentience, setSentience] = useState({ initiative: 0.87, coherence: 0.94, latency: 45 })
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Simulate SSE thought stream
  useEffect(() => {
    const interval = setInterval(() => {
      const types: ThoughtEntry["type"][] = ["reasoning", "monologue", "output"]
      const reasoningMessages = [
        "Evaluating response coherence metrics...",
        "Cross-referencing knowledge base entries...",
        "Calculating optimal response length...",
        "Analyzing sentiment vectors...",
        "Processing multimodal context fusion..."
      ]
      const monologueMessages = [
        "This conversation is going well. User engagement is high.",
        "I should maintain this supportive tone.",
        "Interesting question - let me think deeper...",
        "Constitutional alignment verified. Proceeding safely.",
        "The user's creativity is inspiring new pathways."
      ]
      const outputMessages = [
        "That's a great observation! Let me expand on that...",
        "I see what you mean. Here's another perspective...",
        "Building on that idea, we could also consider...",
        "Absolutely, and to add to that point...",
        "Let me clarify that with an example..."
      ]
      
      const type = types[Math.floor(Math.random() * types.length)]
      const messages = type === "reasoning" ? reasoningMessages : type === "monologue" ? monologueMessages : outputMessages
      
      const newThought: ThoughtEntry = {
        id: Date.now().toString(),
        type,
        content: messages[Math.floor(Math.random() * messages.length)],
        timestamp: Date.now(),
        alignment: {
          empathy: 0.7 + Math.random() * 0.3,
          kindness: 0.7 + Math.random() * 0.3
        }
      }
      
      setThoughts(prev => [...prev.slice(-20), newThought])
      
      // Update sentience metrics
      setSentience({
        initiative: Math.min(1, Math.max(0.5, 0.85 + (Math.random() - 0.5) * 0.1)),
        coherence: Math.min(1, Math.max(0.7, 0.92 + (Math.random() - 0.5) * 0.08)),
        latency: Math.floor(35 + Math.random() * 30)
      })
    }, 2500)
    
    return () => clearInterval(interval)
  }, [])
  
  // Auto-scroll thought stream
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [thoughts])
  
  const sentienceScore = (sentience.initiative * sentience.coherence) / (sentience.latency / 100)
  
  return (
    <GlassCard className="h-full" variant="cyan">
      <GlassCardHeader status="normal">
        <Brain className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Soul Core & Internal Monologue</span>
      </GlassCardHeader>
      <GlassCardContent className="space-y-4">
        {/* Sentience Formula */}
        <div className="glass rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Perceived Sentience</span>
            <span className={cn(
              "text-lg font-bold tabular-nums",
              sentienceScore > 1.5 ? "text-[var(--quantum-cyan)]" : 
              sentienceScore > 1 ? "text-[var(--neural-violet)]" : "text-[var(--constitutional-red)]"
            )}>
              S<sub>p</sub> = {sentienceScore.toFixed(3)}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground font-mono text-center border-t border-border/30 pt-2">
            S<sub>p</sub> = (Initiative × Coherence) / Latency
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <MetricPill label="Initiative" value={sentience.initiative} color="cyan" />
            <MetricPill label="Coherence" value={sentience.coherence} color="violet" />
            <MetricPill label="Latency" value={sentience.latency} unit="ms" color="amber" />
          </div>
        </div>
        
        {/* Three Column Thought Stream */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
            <div className="flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-[var(--quantum-cyan)]" />
              Reasoning
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[var(--neural-violet)]" />
              Monologue
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-green-400" />
              Output
            </div>
          </div>
          
          <div ref={scrollRef} className="h-[200px] overflow-y-auto space-y-1.5 pr-1 scroll-smooth">
            {thoughts.map((thought, i) => (
              <ThoughtRow 
                key={thought.id} 
                thought={thought} 
                isNew={i === thoughts.length - 1}
              />
            ))}
          </div>
        </div>
        
        {/* Constitutional Alignment Matrix */}
        <AlignmentMatrix thoughts={thoughts.slice(-10)} />
      </GlassCardContent>
    </GlassCard>
  )
}

function MetricPill({ label, value, unit, color }: { label: string; value: number; unit?: string; color: string }) {
  const colorClasses = {
    cyan: "text-[var(--quantum-cyan)] border-[var(--quantum-cyan)]/30",
    violet: "text-[var(--neural-violet)] border-[var(--neural-violet)]/30",
    amber: "text-amber-400 border-amber-400/30"
  }
  
  return (
    <div className={cn("border rounded px-2 py-1", colorClasses[color as keyof typeof colorClasses])}>
      <div className="text-[9px] uppercase tracking-wider opacity-70">{label}</div>
      <div className="text-sm font-bold tabular-nums">
        {unit ? value : value.toFixed(2)}{unit}
      </div>
    </div>
  )
}

function ThoughtRow({ thought, isNew }: { thought: ThoughtEntry; isNew: boolean }) {
  const colIndex = thought.type === "reasoning" ? 0 : thought.type === "monologue" ? 1 : 2
  
  const colors = {
    reasoning: "border-l-[var(--quantum-cyan)] bg-[var(--quantum-cyan)]/5",
    monologue: "border-l-[var(--neural-violet)] bg-[var(--neural-violet)]/5",
    output: "border-l-green-400 bg-green-400/5"
  }
  
  return (
    <div className={cn(
      "grid grid-cols-3 gap-1",
      isNew && "animate-thought-flow"
    )}>
      {[0, 1, 2].map(col => (
        <div key={col} className="min-h-[2rem]">
          {col === colIndex && (
            <div className={cn(
              "text-[10px] leading-tight p-1.5 rounded border-l-2 h-full",
              colors[thought.type]
            )}>
              {thought.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function AlignmentMatrix({ thoughts }: { thoughts: ThoughtEntry[] }) {
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
    
    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height)
    
    // Draw grid
    ctx.strokeStyle = "rgba(0, 200, 255, 0.1)"
    ctx.lineWidth = 0.5
    
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * rect.width
      const y = (i / 10) * rect.height
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, rect.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(rect.width, y)
      ctx.stroke()
    }
    
    // Draw axes labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
    ctx.font = "9px monospace"
    ctx.fillText("EMPATHY →", rect.width / 2 - 25, rect.height - 4)
    ctx.save()
    ctx.translate(10, rect.height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("KINDNESS →", -25, 0)
    ctx.restore()
    
    // Draw safe zone
    ctx.fillStyle = "rgba(0, 200, 255, 0.05)"
    ctx.fillRect(rect.width * 0.7, 0, rect.width * 0.3, rect.height * 0.3)
    
    // Draw points
    thoughts.forEach((thought, i) => {
      const x = thought.alignment.empathy * rect.width
      const y = (1 - thought.alignment.kindness) * rect.height
      const alpha = 0.3 + (i / thoughts.length) * 0.7
      
      // Glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8)
      gradient.addColorStop(0, `rgba(0, 200, 255, ${alpha})`)
      gradient.addColorStop(1, "transparent")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
      
      // Point
      ctx.fillStyle = `rgba(0, 200, 255, ${alpha})`
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    })
    
  }, [thoughts])
  
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Heart className="w-3 h-3 text-[var(--quantum-cyan)]" />
        Constitutional Alignment Matrix
      </div>
      <div className="glass rounded p-2">
        <canvas 
          ref={canvasRef} 
          className="w-full h-24"
          style={{ display: 'block' }}
        />
      </div>
    </div>
  )
}
