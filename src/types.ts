export type Tag = string

export type DayIndex = 0 | 1 | 2 | 3 | 4

export interface Task {
  id: string
  label: string
  tags: Tag[]
  dayIndex?: DayIndex // undefined = daily recurring
  oneOff?: boolean
  backlog?: boolean // not assigned to any day — lives in the All list
  source?: 'custom' | 'builtin'
  createdWeekKey?: string // for one-off tasks: the week they were created in
}

export interface CheckedState {
  [weekKey: string]: {
    [taskId: string]: boolean
  }
}

export interface CustomTag {
  name: string // used as the tag id
  color: string // hex color chosen by user
}
