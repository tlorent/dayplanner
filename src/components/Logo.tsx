interface Props {
  size?: number
}

export function Logo({ size = 22 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="32" height="32" rx="8" fill="#C8922A"/>
      <path d="M8 17L13.5 22.5L24 10" stroke="#0C0C0C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
