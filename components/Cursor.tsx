'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const dot  = dotRef.current
    const r    = ringRef.current
    if (!dot || !r) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      dot.style.left = e.clientX + 'px'
      dot.style.top  = e.clientY + 'px'
    }

    const onEnter = () => r.classList.add('hover')
    const onLeave = () => r.classList.remove('hover')

    let raf: number
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      r.style.left = ring.current.x + 'px'
      r.style.top  = ring.current.y + 'px'
      raf = requestAnimationFrame(animate)
    }
    animate()

    const links = document.querySelectorAll('a, button')
    links.forEach(l => { l.addEventListener('mouseenter', onEnter); l.addEventListener('mouseleave', onLeave) })
    window.addEventListener('mousemove', onMove)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      links.forEach(l => { l.removeEventListener('mouseenter', onEnter); l.removeEventListener('mouseleave', onLeave) })
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="c-dot"  />
      <div ref={ringRef} className="c-ring" />
    </>
  )
}
