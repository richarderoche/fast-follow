export default function Icon2up({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 32 32"
      stroke="currentColor"
      {...props}
    >
      <rect width="8" height="9" x="6.5" y="11.5" rx=".5" />
      <rect width="8" height="9" x="17.5" y="11.5" rx=".5" />
    </svg>
  )
}
