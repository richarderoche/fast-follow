'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function ShowHeaderLogo() {
  useGSAP(() => {
    const headerLogo = document.getElementById('header-logo')
    if (!headerLogo) return
    gsap.to(headerLogo, { opacity: 1, duration: 0.8, ease: 'power2.out' })
    headerLogo.classList.add('pointer-events-auto')
  })

  return null
}
;<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" fill="none">
  <path
    d="M0,464.633V85.367A36.824,36.824,0,0,1,10.75,59.386h0A36.825,36.825,0,0,1,0,33.388V0H33.338A36.712,36.712,0,0,1,59.3,10.767h0A36.712,36.712,0,0,1,85.237,0H878.763a36.712,36.712,0,0,1,25.958,10.767h0A36.712,36.712,0,0,1,930.662,0H964V33.388a36.827,36.827,0,0,1-10.738,26l0,0A36.825,36.825,0,0,1,964,85.367V464.633a36.827,36.827,0,0,1-10.738,26l0,0A36.825,36.825,0,0,1,964,516.612V550H930.662a36.712,36.712,0,0,1-25.942-10.767h0A36.712,36.712,0,0,1,878.763,550H85.237A36.712,36.712,0,0,1,59.3,539.233h0A36.712,36.712,0,0,1,33.338,550H0V516.612A36.825,36.825,0,0,1,10.75,490.63h0A36.824,36.824,0,0,1,0,464.633Z"
    fill="currentColor"
  ></path>
</svg>
