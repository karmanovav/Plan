export const TASK_STATUSES = {
  CREATED: "created",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed"
} as const;

export const TASK_STATUS_LABELS = {
  [TASK_STATUSES.CREATED]: "Создана",
  [TASK_STATUSES.IN_PROGRESS]: "В работе",
  [TASK_STATUSES.COMPLETED]: "Выполнено"
} as const;

export const TASK_CATEGORIES = {
  GENERAL: "general",
  WORK: "work",
  PERSONAL: "personal",
  HEALTH: "health",
  EDUCATION: "education"
} as const;

export const TASK_CATEGORY_LABELS = {
  [TASK_CATEGORIES.GENERAL]: "Общие",
  [TASK_CATEGORIES.WORK]: "Работа",
  [TASK_CATEGORIES.PERSONAL]: "Личные",
  [TASK_CATEGORIES.HEALTH]: "Здоровье",
  [TASK_CATEGORIES.EDUCATION]: "Образование"
} as const;

export const TIME_PERIODS = {
  TODAY: "today",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year"
} as const;

export const TIME_PERIOD_LABELS = {
  [TIME_PERIODS.TODAY]: "На сегодня",
  [TIME_PERIODS.WEEK]: "На неделю",
  [TIME_PERIODS.MONTH]: "На месяц",
  [TIME_PERIODS.YEAR]: "На год"
} as const;

export type TaskStatus = keyof typeof TASK_STATUS_LABELS;
export type TaskCategory = keyof typeof TASK_CATEGORY_LABELS;
export type TimePeriod = keyof typeof TIME_PERIOD_LABELS;