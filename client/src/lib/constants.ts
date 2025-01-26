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

// Пастельные цвета для категорий
export const CATEGORY_COLORS: { [key: number]: string } = {
  1: "bg-blue-50 border-blue-200 text-blue-700",
  2: "bg-pink-50 border-pink-200 text-pink-700",
  3: "bg-green-50 border-green-200 text-green-700",
  4: "bg-yellow-50 border-yellow-200 text-yellow-700",
  5: "bg-purple-50 border-purple-200 text-purple-700",
  6: "bg-orange-50 border-orange-200 text-orange-700",
};

export type TaskStatus = keyof typeof TASK_STATUS_LABELS;
export type TaskCategory = keyof typeof TASK_CATEGORY_LABELS;
export type TimePeriod = keyof typeof TIME_PERIOD_LABELS;