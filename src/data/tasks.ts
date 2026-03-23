import type { Task } from '../types'

export const TAGS = [
  'bc',
  'hyf',
  'leeskring',
  'leren',
  'linkedin',
  'instagram',
] as const

export const TAG_COLORS: Record<string, [string, string, string]> = {
  bc: ['#6B9FD4', '#0F1A2E', '#1E3A5F'],
  hyf: ['#C8922A', '#1E1608', '#4A3510'],
  leeskring: ['#A07BC8', '#160F1E', '#3A1F5A'],
  leren: ['#5AAFAF', '#0A1818', '#1A3F3F'],
  linkedin: ['#5A8FC8', '#0A1220', '#1A3050'],
  instagram: ['#C87A9A', '#1E0A14', '#4A1A2A'],
}

export const DAYS: { label: string; short: string }[] = [
  { label: 'Monday', short: 'mo' },
  { label: 'Tuesday', short: 'tu' },
  { label: 'Wednesday', short: 'we' },
  { label: 'Thursday', short: 'th' },
  { label: 'Friday', short: 'fr' },
]

// ─── Daily recurring tasks (every workday) ────────────────────────────────

export const DAILY_TASKS: Task[] = [
  {
    id: 'd1',
    label: 'HYF les-segment schrijven',
    tags: ['hyf'],
  },
  {
    id: 'd2',
    label: 'Frontend Masters video kijken',
    tags: ['leren'],
  },
  {
    id: 'd3',
    label: '30–60 min full-stack app bouwen',
    tags: ['leren'],
  },
  {
    id: 'd4',
    label: 'Reageer op reacties op eigen BC-content',
    tags: ['bc', 'linkedin'],
  },
  {
    id: 'd5',
    label: "5 nieuwe ICP's toevoegen aan pipeline",
    tags: ['bc'],
  },
]

// ─── Day-specific tasks (0=ma, 1=di, 2=wo, 3=do, 4=vr) ───────────────────

export const DAY_TASKS: Task[] = [
  // Maandag — BC content + Leeskring
  {
    id: 'ma1',
    label: 'BC: LinkedIn post schrijven',
    tags: ['bc', 'linkedin'],
    dayIndex: 0,
  },
  {
    id: 'ma2',
    label: 'Leeskring: Instagram post of outreach',
    tags: ['leeskring', 'instagram'],
    dayIndex: 0,
  },

  // Dinsdag — geen extra taken

  // Woensdag — BC content + Leeskring
  {
    id: 'wo1',
    label: 'BC: LinkedIn post schrijven',
    tags: ['bc', 'linkedin'],
    dayIndex: 2,
  },
  {
    id: 'wo2',
    label: 'Leeskring: Instagram post of outreach',
    tags: ['leeskring', 'instagram'],
    dayIndex: 2,
  },

  // Donderdag — BC outreach batch
  {
    id: 'do1',
    label: 'BC: 5–10 outreach mails naar leads',
    tags: ['bc'],
    dayIndex: 3,
  },

  // Vrijdag — BC content + Leeskring
  {
    id: 'vr1',
    label: 'BC: LinkedIn post schrijven',
    tags: ['bc', 'linkedin'],
    dayIndex: 4,
  },
  {
    id: 'vr2',
    label: 'Leeskring: Instagram post of outreach',
    tags: ['leeskring', 'instagram'],
    dayIndex: 4,
  },
]
