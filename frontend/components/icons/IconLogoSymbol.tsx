export default function IconLogoSymbol({
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="360"
      height="360"
      fill="none"
      viewBox="0 0 360 360"
      {...props}
    >
      <path
        fill="currentColor"
        d="M0 0v166h61.85V61.85H166V0zM0 194v166h61.85V255.85H166V194zM194 0v166h61.85V61.85H360V0zM194 194v166h61.85V255.85H360V194z"
      />
    </svg>
  )
}
