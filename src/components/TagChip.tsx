import type { Tag } from '../types'
import { TAG_COLORS } from '../data/tasks'

interface Props {
  tag: Tag
  active?: boolean
  onClick?: () => void
  size?: 'sm' | 'xs'
}

export function TagChip({ tag, active, onClick, size = 'sm' }: Props) {
  const [color, bg, border] = TAG_COLORS[tag] ?? ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.055)', 'rgba(255,255,255,0.09)']

  return (
    <button
      onClick={onClick}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color: color,
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
