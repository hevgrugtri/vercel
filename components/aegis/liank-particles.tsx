"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
  life: number
  maxLife: number
}

interface LiankParticlesProps {
  audioLevel?: number
  className?: string
  particleCount?: number
  reactToAudio?: boolean
}

export function LiankParticles({ 
  audioLevel = 0, 
  className = "",
  particleCount = 50,
  reactToAudio = true
}: LiankParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect()
      setDimensions({ width: rect.width, height: rect.height })
    }
    
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])
  
  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    ctx.scale(dpr, dpr)
    
    const colors = [
      "rgba(0, 200, 255, VAR)",    // Quantum Cyan
      "rgba(140, 100, 255, VAR)",  // Neural Violet
      "rgba(100, 200, 255, VAR)",  // Light Cyan
    ]
    
    const createParticle = (): Particle => {
      const maxLife = 100 + Math.random() * 200
      return {
        x: Math.random() * dimensions.width,
        y: dimensions.height + Math.random() * 50,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.5 - Math.random() * 1.5,
        radius: 1 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife
      }
    }
    
    // Initialize particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        const p = createParticle()
        p.y = Math.random() * dimensions.height
        p.life = Math.random() * p.maxLife
        particlesRef.current.push(p)
      }
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      
      // Audio reactivity multiplier
      const audioMult = reactToAudio ? 1 + audioLevel * 2 : 1
      
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx * audioMult
        particle.y += particle.vy * audioMult
        particle.life++
        
        // Audio reactive behavior
        if (reactToAudio && audioLevel > 0.3) {
          particle.vx += (Math.random() - 0.5) * 0.2 * audioLevel
          particle.radius = (1 + Math.random() * 2) * (1 + audioLevel)
        }
        
        // Calculate alpha based on life
        const lifeRatio = particle.life / particle.maxLife
        let currentAlpha = particle.alpha
        
        if (lifeRatio < 0.1) {
          currentAlpha *= lifeRatio / 0.1  // Fade in
        } else if (lifeRatio > 0.8) {
          currentAlpha *= (1 - (lifeRatio - 0.8) / 0.2)  // Fade out
        }
        
        // Audio boost alpha
        if (reactToAudio) {
          currentAlpha = Math.min(1, currentAlpha * (1 + audioLevel))
        }
        
        // Draw particle
        const color = particle.color.replace("VAR", currentAlpha.toString())
        
        // Glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 4
        )
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, "transparent")
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2)
        ctx.fill()
        
        // Core
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
        
        // Reset particle if dead or out of bounds
        if (particle.life >= particle.maxLife || particle.y < -50) {
          particlesRef.current[index] = createParticle()
        }
        
        // Wrap horizontally
        if (particle.x < 0) particle.x = dimensions.width
        if (particle.x > dimensions.width) particle.x = 0
      })
      
      // Draw connections between nearby particles (when audio is high)
      if (reactToAudio && audioLevel > 0.5) {
        ctx.strokeStyle = `rgba(0, 200, 255, ${audioLevel * 0.15})`
        ctx.lineWidth = 0.5
        
        particlesRef.current.forEach((p1, i) => {
          particlesRef.current.slice(i + 1).forEach(p2 => {
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
            if (dist < 80) {
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          })
        })
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, audioLevel, reactToAudio, particleCount])
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  )
}
