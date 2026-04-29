export default function Icon3up({ ...props }: React.SVGProps<SVGSVGElement>) {
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
      <rect width="4" height="4" x="7.5" y="10.5" rx=".5" />
      <rect width="4" height="4" x="7.5" y="17.5" rx=".5" />
      <rect width="4" height="4" x="14.5" y="10.5" rx=".5" />
      <rect width="4" height="4" x="14.5" y="17.5" rx=".5" />
      <rect width="4" height="4" x="21.5" y="10.5" rx=".5" />
      <rect width="4" height="4" x="21.5" y="17.5" rx=".5" />
    </svg>
  )
}
