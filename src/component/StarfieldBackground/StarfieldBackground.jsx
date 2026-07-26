import React, { useEffect, useRef } from 'react'

export default function StarfieldBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let stars = []

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function createStars() {
      const count = Math.floor((window.innerWidth * window.innerHeight) / 9000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.4 + 0.3,
        baseOpacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.05,
        driftY: (Math.random() - 0.5) * 0.05,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#07040f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        star.twinklePhase += star.twinkleSpeed
        const opacity = star.baseOpacity + Math.sin(star.twinklePhase) * 0.3

        star.x += star.driftX
        star.y += star.driftY

        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(248, 250, 252, ${Math.max(0, opacity)})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(draw)
    }

    resize()
    createStars()
    draw()

    window.addEventListener('resize', () => {
      resize()
      createStars()
    })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}