import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    title: 'Plan your week',
    description:
      'Organize tasks by day and recurring daily habits in one place.',
  },
  {
    title: 'Focus with tags',
    description:
      'Filter tasks by project or area so you only see what matters right now.',
  },
  {
    title: 'Track progress',
    description:
      "A live progress bar keeps you honest about what's actually getting done.",
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Open your week',
    body: 'Every Monday you start fresh. Your recurring daily tasks are already there — just show up.',
  },
  {
    step: '02',
    title: 'Add what matters',
    body: 'Slot in day-specific tasks — meetings, deliverables, one-offs. Tag them so nothing gets buried.',
  },
  {
    step: '03',
    title: 'Work the list',
    body: 'Check things off as you go. The progress bar fills. The list shrinks. Friday feels good.',
  },
]

const versus = [
  { them: 'Sprawling project hierarchies', us: 'One week. Five days. Done.' },
  { them: 'Onboarding flows and tutorials', us: 'Open it. It just works.' },
  {
    them: 'Notifications, nudges, streaks',
    us: 'Silent. You know what to do.',
  },
  {
    them: 'Monthly subscription to check a box',
    us: 'Free. No account needed.',
  },
]

// ─── SVG dot-grid background ──────────────────────────────────────────────────

function HeroDotGrid() {
  const cols = 48
  const rows = 22
  const gx = 28
  const gy = 28
  const dots: { cx: number; cy: number }[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offsetX = r % 2 === 0 ? 0 : gx / 2
      dots.push({ cx: c * gx + offsetX, cy: r * gy })
    }
  }

  const w = (cols - 1) * gx + gx / 2
  const h = (rows - 1) * gy

  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="100%"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      className="hero-dot-grid"
    >
      {dots.map((d, i) => (
        <circle
          // biome-ignore lint/suspicious/noArrayIndexKey: static generated dot grid
          key={i}
          cx={d.cx}
          cy={d.cy}
          r={1.1}
          fill="rgba(200,146,42,0.45)"
        />
      ))}
    </svg>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen text-text">
      {/* ── Nav ── */}
      <header className="nav-header sticky top-0 z-50 w-full">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <Logo size={26} />
            <span className="font-display font-extrabold text-[17px] tracking-[-0.5px] text-text">
              Dunzo
            </span>
          </div>
          <Link to="/login" className="nav-sign-in font-ui">
            Sign in
          </Link>
        </div>
      </header>

      {/* ── Hero — bg-bg ── */}
      <section className="hero-section bg-bg relative flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <HeroDotGrid />
        <div aria-hidden className="hero-bloom" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Pill */}
          <div className="landing-pill hero-pill mb-7">
            <span className="font-ui">Your weekly planner</span>
          </div>

          {/* Headline */}
          <h1 className="landing-headline hero-headline font-display font-extrabold m-0 text-[clamp(40px,8vw,96px)] leading-[1.05] mb-7">
            <span className="text-text block">Don't be on the list.</span>
            <span className="text-[#C8922A] block">
              Get it <span className="strikethrough-done">done</span>.
            </span>
          </h1>

          {/* Subtext */}
          <p className="landing-sub font-ui m-0 text-[clamp(14px,2.5vw,16px)] text-muted max-w-[480px] leading-[1.7] mb-10">
            A no-nonsense week planner built for people who ship. Track tasks,
            filter by project, and actually finish your week.
          </p>

          {/* CTA */}
          <div className="landing-cta">
            <CtaLink to="/login">Start planning</CtaLink>
          </div>

          {/* Feature cards */}
          <div className="hero-cards">
            {features.map((f, i) => (
              <FeatureCard
                key={f.title}
                title={f.title}
                description={f.description}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works — bg-elevated ── */}
      <section className="relative z-10 w-full overflow-hidden bg-elevated border-t border-border border-b border-border">
        <div className="section-pad px-6 max-w-5xl mx-auto">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="font-display font-extrabold m-0 text-[clamp(28px,4vw,44px)] tracking-[-1.5px] mb-[72px] text-text">
            Three steps. <br /> One good week.{' '}
            <span className="text-[#C8922A]">Dunzo.</span>
          </h2>

          <div className="steps-timeline">
            {howItWorks.map((item, i) => (
              <div key={item.step} className={`timeline-row timeline-row-${i}`}>
                <span
                  className="timeline-watermark font-display font-extrabold"
                  aria-hidden
                >
                  {item.step}
                </span>
                <div className="timeline-card timeline-card-inner">
                  <div className="timeline-dot" aria-hidden />
                  <span className="step-number font-ui">{item.step}</span>
                  <h3 className="font-display font-extrabold m-0 text-[clamp(20px,3vw,28px)] tracking-[-0.8px] text-text mb-3">
                    {item.title}
                  </h3>
                  <p className="font-ui m-0 text-[14px] text-muted leading-[1.7] max-w-[340px]">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why it was built — bg-bg ── */}
      <section className="relative z-10 w-full bg-bg">
        <div className="section-pad px-6 max-w-5xl mx-auto">
          <SectionLabel>Why Dunzo</SectionLabel>
          <h2 className="font-display font-extrabold m-0 text-[clamp(28px,4vw,44px)] tracking-[-1.5px] leading-[1.1] text-text mb-12">
            Built because
            <br />
            <span className="text-[#C8922A]">the others</span> got in the way.
          </h2>

          <div className="why-layout">
            <div className="versus-table">
              <div className="versus-header">
                <span className="font-ui text-[11px] font-semibold tracking-[0.1em] text-white/25 uppercase">
                  Every other tool
                </span>
                <span className="font-ui text-[11px] font-semibold tracking-[0.1em] text-[#C8922A] uppercase">
                  Dunzo
                </span>
              </div>
              {versus.map((row, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static data, order never changes
                  key={i}
                  className="versus-row border-t border-border grid grid-cols-2"
                >
                  <div className="py-5 pr-6 border-r border-border">
                    <span className="font-ui versus-them">{row.them}</span>
                  </div>
                  <div className="py-5 pl-6">
                    <span className="font-ui versus-us">{row.us}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="why-svg-wrap" aria-hidden>
              <WhyIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA — bg-elevated ── */}
      <section className="cta-section-pad relative z-10 flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-elevated border-t border-border border-b border-border">
        <div aria-hidden className="cta-bloom" />
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="font-display font-extrabold m-0 text-[clamp(32px,5vw,56px)] tracking-[-2px] leading-[1.05] mb-5 text-text">
            Your week starts now.
          </h2>
          <p className="font-ui m-0 text-[15px] text-muted max-w-[360px] leading-[1.65] mb-9">
            No setup, no onboarding flow, no paywall. Just open it and get to
            work.
          </p>
          <CtaLink to="/login">Open Dunzo</CtaLink>
        </div>
      </section>

      {/* ── Footer — #080808 ── */}
      <footer className="relative z-10 w-full bg-[#080808] py-7 px-6">
        <div className="footer-inner max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span className="font-display font-extrabold text-[14px] tracking-[-0.3px] text-muted">
              Dunzo
            </span>
          </div>
          <span className="font-ui text-[12px] text-white/20">
            Built for getting things done.
          </span>
          <Link
            to="/login"
            className="font-ui no-underline text-[12px] text-muted hover:text-text transition-colors duration-150"
          >
            Sign in →
          </Link>
        </div>
      </footer>
    </div>
  )
}

// ─── Shared components ────────────────────────────────────────────────────────

function CtaLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="cta-btn font-ui">
      {children}
      <svg
        aria-hidden="true"
        className="cta-arrow"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}

function FeatureCard({
  title,
  description,
  index,
}: {
  title: string
  description: string
  index: number
}) {
  return (
    <div className={`landing-card-${index} feature-card`}>
      <h3 className="font-ui m-0 text-[14px] font-semibold text-text mb-2">
        {title}
      </h3>
      <p className="font-ui m-0 text-[13px] text-muted leading-[1.6]">
        {description}
      </p>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label font-ui">{children}</p>
}

// A minimal task-card illustration — week view, progress bar, amber checkmark
function WhyIllustration() {
  const tasks = [
    { label: 'Send weekly update', done: true, width: 120 },
    { label: 'Review PR', done: true, width: 72 },
    { label: 'Write post', done: false, width: 88 },
    { label: 'Prep slides', done: false, width: 80 },
    { label: 'Ship fix', done: false, width: 60 },
  ]
  const done = tasks.filter((t) => t.done).length
  const progress = (done / tasks.length) * 100

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 280 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[280px] block"
    >
      <rect
        x="12"
        y="16"
        width="256"
        height="288"
        rx="14"
        fill="rgba(0,0,0,0.4)"
      />
      <rect
        x="8"
        y="8"
        width="256"
        height="288"
        rx="14"
        fill="#181818"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      <rect
        x="8.5"
        y="8.5"
        width="255"
        height="14"
        rx="13.5"
        fill="rgba(255,255,255,0.03)"
      />
      <rect x="8" y="8" width="256" height="44" rx="14" fill="#1E1E1E" />
      <rect x="8" y="30" width="256" height="22" fill="#1E1E1E" />
      <rect x="8" y="51" width="256" height="1" fill="rgba(255,255,255,0.07)" />

      {['M', 'T', 'W', 'T', 'F'].map((d, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static SVG illustration
        <g key={i}>
          <rect
            x={24 + i * 46}
            y="16"
            width="36"
            height="22"
            rx="6"
            fill={i === 2 ? '#C8922A' : 'rgba(255,255,255,0.05)'}
          />
          <text
            x={42 + i * 46}
            y="31"
            textAnchor="middle"
            fontFamily="Geist, sans-serif"
            fontSize="10"
            fontWeight="600"
            fill={i === 2 ? '#0C0C0C' : 'rgba(255,255,255,0.35)'}
          >
            {d}
          </text>
        </g>
      ))}

      <text
        x="24"
        y="74"
        fontFamily="Geist, sans-serif"
        fontSize="9"
        fontWeight="600"
        fill="rgba(255,255,255,0.3)"
        letterSpacing="0.08em"
      >
        WEDNESDAY
      </text>
      <text
        x="240"
        y="74"
        textAnchor="end"
        fontFamily="Geist, sans-serif"
        fontSize="9"
        fontWeight="600"
        fill="#C8922A"
      >
        {done}/{tasks.length}
      </text>

      <rect
        x="24"
        y="80"
        width="232"
        height="3"
        rx="1.5"
        fill="rgba(255,255,255,0.06)"
      />
      <rect
        x="24"
        y="80"
        width={(232 * progress) / 100}
        height="3"
        rx="1.5"
        fill="#C8922A"
        opacity="0.8"
      />

      {tasks.map((task, i) => {
        const y = 102 + i * 40
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: static SVG illustration
          <g key={i}>
            {task.done && (
              <rect
                x="16"
                y={y - 4}
                width="248"
                height="32"
                rx="8"
                fill="rgba(200,146,42,0.04)"
              />
            )}
            <rect
              x="24"
              y={y}
              width="18"
              height="18"
              rx="5"
              fill={task.done ? '#C8922A' : 'transparent'}
              stroke={task.done ? '#C8922A' : 'rgba(255,255,255,0.15)'}
              strokeWidth="1.2"
            />
            {task.done && (
              <path
                d={`M${28} ${y + 9}l4 4 6.5-8`}
                stroke="#0C0C0C"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <rect
              x="52"
              y={y + 4}
              width={task.width}
              height="9"
              rx="4"
              fill={
                task.done ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.2)'
              }
            />
            {i < tasks.length - 1 && (
              <line
                x1="24"
                y1={y + 30}
                x2="256"
                y2={y + 30}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            )}
          </g>
        )
      })}

      <defs>
        <radialGradient id="cardGlow" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#C8922A" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#C8922A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect
        x="8"
        y="8"
        width="256"
        height="288"
        rx="14"
        fill="url(#cardGlow)"
      />
    </svg>
  )
}
