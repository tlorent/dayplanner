import { TAG_COLORS } from '../data/tasks'

interface Props {
  tag: string
  color?: string // hex — if omitted, falls back to TAG_COLORS
  active?: boolean
  onClick?: () => void
  size?: 'sm' | 'xs'
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export function TagChip({ tag, color, active, onClick, size = 'sm' }: Props) {
  let textColor: string, bg: string, border: string

  if (color) {
    const [r, g, b] = hexToRgb(color)
    textColor = color
    bg = `rgba(${r},${g},${b},0.12)`
    border = `rgba(${r},${g},${b},0.3)`
  } else {
    ;[textColor, bg, border] = TAG_COLORS[tag] ?? [
      'rgba(255,255,255,0.5)',
      'rgba(255,255,255,0.055)',
      'rgba(255,255,255,0.09)',
    ]
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color: textColor,
        opacity: active ? 1 : 0.75,
        borderRadius: '4px',
        padding: size === 'xs' ? '1px 6px' : '2px 8px',
        fontSize: size === 'xs' ? '10px' : '11px',
        fontFamily: 'var(--font-ui)',
        fontWeight: 500,
        letterSpacing: '0.02em',
        cursor: onClick ? 'pointer' : 'default',
        lineHeight: '1.6',
        transition: 'all 0.15s ease',
      }}
    >
      {tag}
    </button>
  )
}
