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

export type TaskStatus = keyof typeof TASK_STATUS_LABELS;
