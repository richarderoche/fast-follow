'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function ShowHeaderLogo() {
  useGSAP(() => {
    const headerLogo = document.getElementById('header-logo')
    if (!headerLogo) return
    gsap.to(headerLogo, { opacity: 1, duration: 0.8, ease: 'power2.out' })
  })

  return null
}
