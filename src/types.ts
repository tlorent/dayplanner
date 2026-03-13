export type Tag = 'bc' | 'pingpilot' | 'hyf' | 'leeskring' | 'sudo' | 'leren' | 'linkedin' | 'instagram'

export type DayIndex = 0 | 1 | 2 | 3 | 4

export interface Task {
  id: string
  label: string
  tags: Tag[]
  dayIndex?: DayIndex // undefined = daily recurring
  oneOff?: boolean
  source?: 'custom' | 'builtin'
  createdWeekKey?: string // for one-off tasks: the week they were created in
}

export interface CheckedState {
  [weekKey: string]: {
    [taskId: string]: boolean
  }
}
