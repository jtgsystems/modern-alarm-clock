import type * as React from "react"

export function Shirt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" fill="#34D399" stroke="#10B981" strokeWidth="1.5"/>
    </svg>
  )
}

export function Jacket(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M16 3h3a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" fill="#93C5FD" />
      <path d="M9 3v18M15 3v18" stroke="#60A5FA" strokeWidth="1.5"/>
      <path d="M9 13h6M9 18h6" stroke="#60A5FA" strokeWidth="1.5"/>
      <path d="M8 3a2 2 0 0 1 4 0M16 3a2 2 0 0 0-4 0" stroke="#3B82F6" strokeWidth="1.5"/>
    </svg>
  )
}

export function Hat(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M3 7C3 5.34315 4.34315 4 6 4H18C19.6569 4 21 5.34315 21 7V10C21 11.6569 19.6569 13 18 13H6C4.34315 13 3 11.6569 3 10V7Z" fill="#F472B6"/>
      <path d="M3 10V14C3 15.6569 4.34315 17 6 17H18C19.6569 17 21 15.6569 21 14V10" stroke="#EC4899" strokeWidth="1.5"/>
      <path d="M7 4V13M17 4V13" stroke="#DB2777" strokeWidth="1.5"/>
    </svg>
  )
}

export function Gloves(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M6 4v10c0 2.21 1.79 4 4 4s4-1.79 4-4V4" fill="#A78BFA"/>
      <path d="M6 4h12M6 14h12" stroke="#8B5CF6" strokeWidth="1.5"/>
      <path d="M10 14v4M14 14v4" stroke="#7C3AED" strokeWidth="1.5"/>
    </svg>
  )
}

