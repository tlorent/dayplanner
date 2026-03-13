import type { Tag, DayIndex } from './types'
import { useWeekStore, selectProgress, selectDayProgress } from './store/useWeekStore'
import { DAYS, TAGS, TAG_COLORS } from './data/tasks'
import { DaySection } from './components/DaySection'
import { DailySection } from './components/DailySection'
import { AddTaskModal } from './components/AddTaskModal'
import { useState } from 'react'

function getTodayIndex(): DayIndex | null {
  const d = new Date().getDay()
  if (d === 0 || d === 6) return null
  return (d - 1) as DayIndex
}

export default function App() {
  const activeDay = useWeekStore((s) => s.activeDay)
  const activeTag = useWeekStore((s) => s.activeTag)
  const setActiveDay = useWeekStore((s) => s.setActiveDay)
  const setActiveTag = useWeekStore((s) => s.setActiveTag)
  const resetDay = useWeekStore((s) => s.resetDay)
  const enableAllBuiltins = useWeekStore((s) => s.enableAllBuiltins)
  const checked = useWeekStore((s) => s.checked)
  const customTasks = useWeekStore((s) => s.customTasks)
  const disabledBuiltinIds = useWeekStore((s) => s.disabledBuiltinIds)
  const dailySectionOpen = useWeekStore((s) => s.dailySectionOpen)
  const setDailySectionOpen = useWeekStore((s) => s.setDailySectionOpen)

  const progress = selectProgress(checked, customTasks, activeTag, activeDay, disabledBuiltinIds)

  const [showAddModal, setShowAddModal] = useState(false)

  const todayIndex = getTodayIndex()
  const progressPct = progress.total > 0 ? (progress.done / progress.total) * 100 : 0

  const handleResetDay = () => {
    if (window.confirm('Reset alle taken voor vandaag?')) {
      resetDay()
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Topbar */}
      <header className="sticky top-0 z-100 bg-elevated border-b border-border backdrop-blur-md">
        <div className="px-6 h-13 flex items-center gap-4">
          <span className="font-display font-extrabold text-[22px] leading-none text-white/90 shrink-0" style={{ letterSpacing: '-0.5px' }}>
            Tim
          </span>
          <span className="w-px h-3.5 bg-white/10 shrink-0" />
          <span className="text-[13px] font-semibold text-white/60 tracking-[0.04em] shrink-0">
            Weekplanning
          </span>
          <span className="w-px h-3.5 bg-white/10 shrink-0" />

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-muted tabular-nums shrink-0">
              {progress.done}/{progress.total}
            </span>
            <div className="w-32 h-0.75 bg-white/8 rounded-sm overflow-hidden">
              <div
                className="h-full rounded-sm transition-[width] duration-600 ease-in-out"
                style={{ width: `${progressPct}%`, background: '#C8922A' }}
              />
            </div>
            <span className="text-[11px] text-muted tabular-nums shrink-0">
              {Math.round(progressPct)}%
            </span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex min-h-[calc(100vh-52px)]">

        {/* Left sidebar */}
        <aside className="fade-up delay-0 w-52 shrink-0 sticky top-13 self-start h-[calc(100vh-52px)] bg-elevated flex-col px-4 py-6 overflow-y-auto hidden md:flex" style={{ borderRight: '1px solid rgba(200,146,42,0.12)' }}>

          {/* Day nav */}
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted mb-2.5">
              Week
            </p>
            <nav className="flex flex-col gap-0.5">
              {DAYS.map((day, i) => {
                const isActive = activeDay === i
                const isToday = todayIndex === i
                const dp = selectDayProgress(checked, customTasks, i as DayIndex, disabledBuiltinIds)
                return (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i as DayIndex)}
                    className={[
                      'flex items-center gap-2 px-2.5 py-1.75 rounded-md border-none font-ui text-[13px] cursor-pointer text-left transition-all duration-150 w-full',
                      isActive
                        ? 'bg-white/8 text-white/90 font-medium'
                        : 'bg-transparent text-white/50 font-normal hover:bg-hover',
                    ].join(' ')}
                    style={isActive ? { borderLeft: '2px solid #C8922A', paddingLeft: '8px' } : { borderLeft: '2px solid transparent', paddingLeft: '8px' }}
                  >
                    <span className="w-1.25 h-1.25 rounded-full shrink-0" style={{ background: isToday ? '#C8922A' : 'transparent' }} />
                    <span className="flex-1">{day.label}</span>
                    <span className="text-[10px] tabular-nums text-white/50">{dp.done}/{dp.total}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tag filter */}
          <div className="flex-1 mt-6">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted mb-2.5">
              Filter
            </p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setActiveTag(null)}
                className={[
                  'flex items-center px-2.5 py-1.25 rounded-md border-none font-ui text-[12px] cursor-pointer text-left transition-all duration-150',
                  activeTag === null
                    ? 'bg-white/8 text-white/90'
                    : 'bg-transparent text-white/50 hover:bg-hover',
                ].join(' ')}
              >
                Alles
              </button>
              {[...TAGS].sort().map((tag) => {
                const [color] = TAG_COLORS[tag] ?? ['rgba(255,255,255,0.4)']
                const isActive = activeTag === tag
                return (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(isActive ? null : tag as Tag)}
                    className="flex items-center gap-2 px-2.5 py-1.25 rounded-md border-none font-ui text-[12px] cursor-pointer text-left transition-all duration-150 hover:bg-hover"
                    style={{ color: isActive ? color : 'rgba(255,255,255,0.5)', background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Restore hidden built-ins — only shown when some are hidden */}
          {disabledBuiltinIds.length > 0 && (
            <button
              onClick={enableAllBuiltins}
              className="w-full text-left px-2.5 py-1.5 rounded-md border-none bg-transparent font-ui text-[11px] cursor-pointer transition-all duration-150 hover:bg-hover mb-2"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              ↩ {disabledBuiltinIds.length} verborgen {disabledBuiltinIds.length !== 1 ? 'taken' : 'taak'} herstellen
            </button>
          )}

          {/* Add task — pinned to bottom */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md font-ui text-[12px] font-medium cursor-pointer transition-all duration-150"
            style={{
              background: 'rgba(200,146,42,0.08)',
              border: '1px solid rgba(200,146,42,0.25)',
              color: '#C8922A',
            }}
          >
            + taak toevoegen
          </button>
        </aside>

        {/* Main content */}
        <main className="main-content flex-1 min-w-0 px-4 md:px-10 py-8">

          {/* Day title */}
          <div className="fade-up delay-1 mb-8">
            <h1 className="font-display font-extrabold text-[42px] md:text-[72px] leading-none text-white/92 m-0" style={{ letterSpacing: '-1.5px' }}>
              {DAYS[activeDay].label}
            </h1>
            {todayIndex === activeDay && (
              <p className="m-0 mt-1.5 font-ui text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: '#C8922A' }}>
                — Vandaag
              </p>
            )}
          </div>

          {/* Mobile: day selector */}
          <div className="flex md:hidden gap-1 mb-6 overflow-x-auto pb-1">
            {DAYS.map((day, i) => {
              const isActive = activeDay === i
              const isToday = todayIndex === i
              return (
                <button
                  key={i}
                  onClick={() => setActiveDay(i as DayIndex)}
                  className={[
                    'shrink-0 px-3 py-1.5 rounded-md border-none font-ui text-[12px] cursor-pointer transition-all duration-150',
                    isActive ? 'bg-white/10 text-white/90 font-medium' : 'bg-transparent text-white/40 hover:bg-hover',
                  ].join(' ')}
                  style={isActive ? { outline: `1.5px solid ${isToday ? '#C8922A' : 'rgba(255,255,255,0.2)'}` } : {}}
                >
                  {day.short}
                </button>
              )
            })}
          </div>

          {/* Dag-specifiek section */}
          <section className="fade-up delay-2 mb-8">
            <div className="mb-3">
              <h2 className="m-0 text-[11px] font-semibold tracking-widest uppercase text-muted">
                Dag-specifiek
              </h2>
            </div>
            <DaySection />
          </section>

          {/* Dagelijks section */}
          <section className="fade-up delay-3 mb-8">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setDailySectionOpen(!dailySectionOpen)}
                className="flex items-center gap-2 border-none bg-transparent cursor-pointer p-0"
              >
                <h2 className="m-0 text-[11px] font-semibold tracking-widest uppercase text-muted flex items-center gap-2">
                  Dagelijks
                  <span className="text-[10px] text-white/50">{dailySectionOpen ? '▾' : '▸'}</span>
                </h2>
              </button>
              <span
                onClick={handleResetDay}
                className={`px-2.5 py-1 rounded-[5px] border border-border bg-transparent text-muted font-ui text-[11px] cursor-pointer transition-all duration-150 hover:bg-hover hover:text-text ${dailySectionOpen ? '' : 'invisible'}`}
              >
                Reset dag
              </span>
            </div>
            {dailySectionOpen && <DailySection />}
          </section>

          {/* Mobile: add task button */}
          <div className="md:hidden mt-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md font-ui text-[13px] font-medium cursor-pointer transition-all duration-150"
              style={{
                background: 'rgba(200,146,42,0.08)',
                border: '1px solid rgba(200,146,42,0.25)',
                color: '#C8922A',
              }}
            >
              + taak toevoegen
            </button>
          </div>
        </main>
      </div>

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
