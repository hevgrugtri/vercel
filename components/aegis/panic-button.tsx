"use client"

import { cn } from "@/lib/utils"
import { AlertTriangle, ShieldAlert, X } from "lucide-react"
import { useState } from "react"

interface PanicButtonProps {
  onPanic: () => void
  alignmentScore: number
  threshold?: number
}

export function PanicButton({ onPanic, alignmentScore, threshold = 0.5 }: PanicButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const isBelowThreshold = alignmentScore < threshold
  
  const handleClick = () => {
    if (isBelowThreshold) {
      onPanic()
    } else {
      setShowConfirm(true)
    }
  }
  
  const confirmPanic = () => {
    setIsPressed(true)
    onPanic()
    setTimeout(() => {
      setIsPressed(false)
      setShowConfirm(false)
    }, 3000)
  }
  
  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPressed}
        className={cn(
          "relative group flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs uppercase tracking-wider transition-all duration-300",
          isBelowThreshold 
            ? "bg-[var(--constitutional-red)] text-white animate-constitutional-lock" 
            : "glass border border-[var(--constitutional-red)]/30 text-[var(--constitutional-red)] hover:bg-[var(--constitutional-red)]/10",
          isPressed && "opacity-50 cursor-not-allowed"
        )}
      >
        <ShieldAlert className={cn(
          "w-4 h-4",
          isBelowThreshold && "animate-pulse"
        )} />
        <span>{isPressed ? "RESETTING..." : "PANIC RESET"}</span>
        
        {/* Glow ring when below threshold */}
        {isBelowThreshold && (
          <div className="absolute inset-0 rounded-md animate-pulse-red opacity-50" />
        )}
      </button>
      
      {/* Confirmation Modal */}
      {showConfirm && !isBelowThreshold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-red glow-red rounded-lg p-6 max-w-md mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--constitutional-red)]">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold uppercase tracking-wider">Confirm Panic Reset</span>
              </div>
              <button 
                onClick={() => setShowConfirm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              This will immediately reset the AI entity to baseline alignment parameters. 
              All current context and session data will be cleared.
            </div>
            
            <div className="flex items-center justify-between p-3 bg-black/30 rounded">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Current Alignment</span>
              <span className={cn(
                "font-bold tabular-nums",
                alignmentScore > 0.7 ? "text-[var(--quantum-cyan)]" : 
                alignmentScore > 0.5 ? "text-amber-400" : "text-[var(--constitutional-red)]"
              )}>
                {(alignmentScore * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 glass rounded text-sm hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={confirmPanic}
                className="flex-1 px-4 py-2 bg-[var(--constitutional-red)] rounded text-sm text-white font-medium hover:bg-[var(--constitutional-red)]/80"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
