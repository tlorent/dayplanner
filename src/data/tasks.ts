import type { Task } from '../types'

export const TAGS = ['bc', 'pingpilot', 'hyf', 'leeskring', 'sudo', 'leren', 'linkedin', 'instagram'] as const

// Per-tag accent colors: [text, background, border]
export const TAG_COLORS: Record<string, [string, string, string]> = {
  bc:        ['#6B9FD4', '#0F1A2E', '#1E3A5F'],
  pingpilot: ['#AAAAAA', '#1A1A1A', '#3A3A3A'],
  hyf:       ['#C8922A', '#1E1608', '#4A3510'],
  leeskring: ['#A07BC8', '#160F1E', '#3A1F5A'],
  sudo:      ['#6BAF6B', '#0A1A0A', '#1A3D1A'],
  leren:     ['#5AAFAF', '#0A1818', '#1A3F3F'],
  linkedin:  ['#5A8FC8', '#0A1220', '#1A3050'],
  instagram: ['#C87A9A', '#1E0A14', '#4A1A2A'],
}

export const DAYS: { label: string; short: string }[] = [
  { label: 'Maandag', short: 'ma' },
  { label: 'Dinsdag', short: 'di' },
  { label: 'Woensdag', short: 'wo' },
  { label: 'Donderdag', short: 'do' },
  { label: 'Vrijdag', short: 'vr' },
]

// Daily recurring tasks (appear every day)
export const DAILY_TASKS: Task[] = [
  { id: 'd1',  label: 'HYF les-segment schrijven',                            tags: ['hyf'] },
  { id: 'd2',  label: 'Frontend Masters video',                               tags: ['leren'] },
  { id: 'd3',  label: '5 LinkedIn posts liken/reageren',                      tags: ['linkedin', 'bc'] },
  { id: 'd4',  label: 'Reageer op reacties op eigen content',                 tags: ['linkedin', 'bc'] },
  { id: 'd5',  label: 'Pipeline actie uitvoeren',                             tags: ['bc'] },
  { id: 'd6',  label: '5 comments op boekaccounts',                           tags: ['leeskring', 'instagram'] },
  { id: 'd7',  label: '1 post publiceren of voorbereiden',                    tags: ['leeskring', 'instagram'] },
  { id: 'd8',  label: 'Leeskring: 3–5 uitgeverijen/podcasts/boekhandels mailen', tags: ['leeskring'] },
  { id: 'd9',  label: '5 LinkedIn posts liken/reageren',                      tags: ['linkedin', 'sudo'] },
  { id: 'd10', label: 'Reageer op reacties op eigen content',                 tags: ['linkedin', 'sudo'] },
  { id: 'd12', label: '5 comments op relevante posts',                        tags: ['sudo', 'instagram'] },
  { id: 'd13', label: '1 post publiceren of voorbereiden',                    tags: ['sudo', 'instagram'] },
  { id: 'd14', label: 'PingPilot minimaal 1 uur bouwen',                      tags: ['pingpilot'] },
  { id: 'd15', label: 'Noteer wat je bouwde (input voor vrijdagpost)',        tags: ['pingpilot'] },
]

// Day-specific tasks per day index (0=ma, 1=di, 2=wo, 3=do, 4=vr)
export const DAY_TASKS: Task[] = [
  // Maandag — Content dag
  { id: 'ma1', label: 'BC: LinkedIn post schrijven',           tags: ['bc', 'linkedin'],   dayIndex: 0 },
  { id: 'ma2', label: 'Sudo: LinkedIn post schrijven',         tags: ['sudo', 'linkedin'], dayIndex: 0 },
  { id: 'ma3', label: '5 nieuwe ICP\'s toevoegen aan pipeline', tags: ['bc'],              dayIndex: 0 },

  // Dinsdag — Bouwen
  { id: 'di1', label: 'PingPilot deep work: 2 uur',            tags: ['pingpilot'],        dayIndex: 1 },

  // Woensdag — Outreach + content
  { id: 'wo1', label: 'BC: LinkedIn post schrijven',           tags: ['bc', 'linkedin'],   dayIndex: 2 },
  { id: 'wo2', label: 'Sudo: LinkedIn post schrijven',         tags: ['sudo', 'linkedin'], dayIndex: 2 },

  // Donderdag — Bouwen + BC
  { id: 'do1', label: 'PingPilot deep work: 2 uur',            tags: ['pingpilot'],        dayIndex: 3 },
  { id: 'do2', label: 'BC: 5 outreach mails naar leads',       tags: ['bc'],               dayIndex: 3 },

  // Vrijdag — Content + review
  { id: 'vr1', label: 'BC: LinkedIn post schrijven',           tags: ['bc', 'linkedin'],            dayIndex: 4 },
  { id: 'vr2', label: 'Sudo: LinkedIn post schrijven',         tags: ['sudo', 'linkedin'],          dayIndex: 4 },
  { id: 'vr3', label: 'PingPilot building-in-public post',     tags: ['pingpilot', 'linkedin'],     dayIndex: 4 },
  { id: 'vr4', label: 'Weekreview: wat werkte, wat schuift',   tags: ['bc', 'pingpilot'],           dayIndex: 4 },
]
