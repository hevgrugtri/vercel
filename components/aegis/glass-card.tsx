"use client"

import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "cyan" | "violet" | "red"
  glow?: boolean
  pulse?: boolean
}

export function GlassCard({ 
  children, 
  className, 
  variant = "default",
  glow = false,
  pulse = false
}: GlassCardProps) {
  const variantClasses = {
    default: "glass",
    cyan: "glass glow-cyan",
    violet: "glass-violet glow-violet",
    red: "glass-red glow-red"
  }
  
  const pulseClasses = {
    default: "",
    cyan: "animate-pulse-cyan",
    violet: "animate-pulse-violet",
    red: "animate-pulse-red"
  }
  
  return (
    <div 
      className={cn(
        "rounded-md p-4 relative overflow-hidden transition-all duration-300",
        variantClasses[variant],
        glow && variantClasses[variant],
        pulse && pulseClasses[variant],
        className
      )}
    >
      {children}
    </div>
  )
}

interface GlassCardHeaderProps {
  children: ReactNode
  className?: string
  status?: "normal" | "processing" | "alert"
}

export function GlassCardHeader({ children, className, status = "normal" }: GlassCardHeaderProps) {
  const statusColors = {
    normal: "text-[var(--quantum-cyan)]",
    processing: "text-[var(--neural-violet)]",
    alert: "text-[var(--constitutional-red)]"
  }
  
  return (
    <div className={cn("flex items-center justify-between mb-3 pb-2 border-b border-border/30", className)}>
      <div className={cn("flex items-center gap-2", statusColors[status])}>
        {children}
      </div>
      <StatusDot status={status} />
    </div>
  )
}

function StatusDot({ status }: { status: "normal" | "processing" | "alert" }) {
  const colors = {
    normal: "bg-[var(--quantum-cyan)]",
    processing: "bg-[var(--neural-violet)]",
    alert: "bg-[var(--constitutional-red)]"
  }
  
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("w-1.5 h-1.5 rounded-full animate-status", colors[status])} />
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {status}
      </span>
    </div>
  )
}

export function GlassCardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("", className)}>{children}</div>
}
