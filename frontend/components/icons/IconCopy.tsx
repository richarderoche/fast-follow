export default function IconCopy({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.125 6.375h9.25a.25.25 0 0 1 .25.25v9.25a.25.25 0 0 1-.25.25h-9.25a.25.25 0 0 1-.25-.25v-9.25a.25.25 0 0 1 .25-.25" />
      <path d="M5.625 3.125h11.25v11.25" />
    </svg>
  )
}
