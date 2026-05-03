export default function IconNavClose({
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="var(--color-body)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="15.5"
        fill="var(--color-bg)"
      />
      <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" />
      <path d="M10 10L22.0208 22.0208" />
      <path d="M10 22L22.0208 9.97918" />
    </svg>
  )
}
