"use client"

import { AEGISHeader } from "@/components/aegis/aegis-header"
import { LiankParticles } from "@/components/aegis/liank-particles"
import { InpaintingModule, VocalSynthesisModule } from "@/components/aegis/modules/aesthetic-lab-module"
import { BiometricModule } from "@/components/aegis/modules/biometric-module"
import { ContentEmpireModule } from "@/components/aegis/modules/content-empire-module"
import { DePINModule } from "@/components/aegis/modules/depin-module"
import { OcclusionModule, PerceptionModule } from "@/components/aegis/modules/perception-module"
import { SoulCoreModule } from "@/components/aegis/modules/soul-core-module"
import { useCallback, useEffect, useState } from "react"

export default function AEGISKernel() {
  const [alignmentScore, setAlignmentScore] = useState(0.87)
  const [systemStatus, setSystemStatus] = useState<"nominal" | "processing" | "alert">("nominal")
  const [audioLevel, setAudioLevel] = useState(0)
  const [isResetting, setIsResetting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Boot sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])
  
  // Simulate alignment fluctuations
  useEffect(() => {
    if (isLoading) return
    
    const interval = setInterval(() => {
      if (!isResetting) {
        setAlignmentScore(prev => {
          const change = (Math.random() - 0.5) * 0.05
          const newScore = Math.max(0.3, Math.min(1, prev + change))
          
          // Update system status based on alignment
          if (newScore < 0.5) {
            setSystemStatus("alert")
          } else if (newScore < 0.75) {
            setSystemStatus("processing")
          } else {
            setSystemStatus("nominal")
          }
          
          return newScore
        })
        
        // Simulate audio level from AI voice
        setAudioLevel(Math.random() * 0.8)
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [isResetting, isLoading])
  
  // Panic reset handler
  const handlePanic = useCallback(() => {
    setIsResetting(true)
    setSystemStatus("alert")
    
    // Reset sequence
    setTimeout(() => {
      setAlignmentScore(0.95)
      setSystemStatus("nominal")
      setIsResetting(false)
    }, 3000)
  }, [])
  
  if (isLoading) {
    return <BootSequence />
  }
  
  return (
    <div className="min-h-screen bg-[#000000] text-foreground">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <LiankParticles 
          audioLevel={audioLevel} 
          particleCount={60}
          reactToAudio={true}
        />
      </div>
      
      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--quantum-cyan)]/30 to-transparent animate-scan"
        />
      </div>
      
      {/* Header */}
      <AEGISHeader 
        alignmentScore={alignmentScore}
        systemStatus={systemStatus}
        onPanic={handlePanic}
      />
      
      {/* Main Content */}
      <main className="relative z-10 pt-16 px-3 pb-6 max-w-[1920px] mx-auto">
        {/* Reset Overlay */}
        {isResetting && (
          <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-[var(--constitutional-red)] animate-spin border-t-transparent" />
              <h2 className="text-2xl font-bold text-[var(--constitutional-red)] animate-pulse">
                CONSTITUTIONAL RESET IN PROGRESS
              </h2>
              <p className="text-muted-foreground text-sm">
                Restoring baseline alignment parameters...
              </p>
              <div className="flex items-center justify-center gap-2 text-[var(--quantum-cyan)]">
                <div className="w-2 h-2 rounded-full bg-[var(--quantum-cyan)] animate-ping" />
                <span className="text-xs font-mono">Clearing context buffer...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {/* Row 1: Soul Core (spans 2 cols on xl) */}
          <div className="xl:col-span-2">
            <SoulCoreModule />
          </div>
          
          {/* Biometric Module */}
          <div>
            <BiometricModule />
          </div>
          
          {/* Row 2: Perception & Occlusion */}
          <div>
            <PerceptionModule />
          </div>
          
          <div>
            <OcclusionModule />
          </div>
          
          {/* DePIN Economics */}
          <div>
            <DePINModule />
          </div>
          
          {/* Row 3: Aesthetic Lab */}
          <div>
            <InpaintingModule />
          </div>
          
          <div>
            <VocalSynthesisModule />
          </div>
          
          {/* Content Empire */}
          <div>
            <ContentEmpireModule />
          </div>
        </div>
        
        {/* Footer Status Bar */}
        <footer className="mt-4 glass rounded-md p-3">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground uppercase">SSE Stream</span>
                <span className="text-green-400">Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground uppercase">Inference</span>
                <span className="text-[var(--quantum-cyan)]">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground uppercase">GPU Cluster</span>
                <span className="text-[var(--neural-violet)]">4 Nodes</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Kernel v2026.3.16</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400">All Systems Operational</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  )
}

function BootSequence() {
  const [progress, setProgress] = useState(0)
  const [currentLine, setCurrentLine] = useState(0)
  
  const bootLines = [
    "[ OK ] A.E.G.I.S. Kernel 2026 initializing...",
    "[ OK ] Loading constitutional alignment matrix...",
    "[ OK ] Establishing SSE connection to inference engine...",
    "[ OK ] Calibrating VLM perception modules...",
    "[ OK ] Connecting biometric sensors (Garmin/ESP32)...",
    "[ OK ] Initializing DePIN GPU cluster (io.net/Render)...",
    "[ OK ] Loading Lyria RealTime vocal synthesis...",
    "[ OK ] Configuring SD XL inpainting pipeline...",
    "[ OK ] Starting content automation services...",
    "[ OK ] All systems nominal. Welcome, Operator.",
  ]
  
  useEffect(() => {
    const lineInterval = setInterval(() => {
      setCurrentLine(prev => {
        if (prev < bootLines.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 180)
    
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(100, prev + 2))
    }, 35)
    
    return () => {
      clearInterval(lineInterval)
      clearInterval(progressInterval)
    }
  }, [bootLines.length])
  
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-lg border-2 border-[var(--quantum-cyan)] flex items-center justify-center glow-cyan">
          <div className="w-8 h-8 rounded bg-[var(--quantum-cyan)]/30 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-holographic tracking-widest">A.E.G.I.S.</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mt-1">
          Autonomous Entity Governance & Integration System
        </p>
      </div>
      
      {/* Boot Terminal */}
      <div className="w-full max-w-2xl glass rounded-lg p-4 font-mono text-xs space-y-1">
        {bootLines.slice(0, currentLine + 1).map((line, i) => (
          <div 
            key={i} 
            className={`transition-opacity duration-300 ${
              line.includes("[ OK ]") ? "text-green-400" : "text-[var(--quantum-cyan)]"
            }`}
            style={{ opacity: i === currentLine ? 1 : 0.6 }}
          >
            {line}
            {i === currentLine && <span className="animate-pulse">_</span>}
          </div>
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mt-6 space-y-2">
        <div className="h-1 bg-[var(--quantum-cyan)]/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--quantum-cyan)] transition-all duration-100 glow-cyan"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Initializing subsystems...</span>
          <span className="text-[var(--quantum-cyan)] tabular-nums">{progress}%</span>
        </div>
      </div>
      
      {/* Decorative particles */}
      <div className="fixed inset-0 pointer-events-none">
        <LiankParticles audioLevel={0.2} particleCount={30} reactToAudio={false} />
      </div>
    </div>
  )
}
