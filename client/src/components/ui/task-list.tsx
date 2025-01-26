import { TaskCard } from "@/components/ui/task-card";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@db/schema";
import { isToday, isThisWeek, isThisMonth, isThisYear } from "date-fns";
import { TaskStatus, TaskCategory, TimePeriod } from "@/lib/constants";

interface TaskListProps {
  statusFilter: TaskStatus | "all";
  categoryFilter: TaskCategory | "all";
  periodFilter: TimePeriod;
  selectedDate: Date;
}

export function TaskList({
  statusFilter,
  categoryFilter,
  periodFilter,
  selectedDate
}: TaskListProps) {
  const { data: tasks, isLoading } = useQuery<(Task & { categoryName?: string })[]>({
    queryKey: ["/api/tasks"],
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  const filterByPeriod = (task: Task) => {
    const taskDate = new Date(task.dueDate);
    switch (periodFilter) {
      case "today":
        return isToday(taskDate);
      case "week":
        return isThisWeek(taskDate);
      case "month":
        return isThisMonth(taskDate);
      case "year":
        return isThisYear(taskDate);
      default:
        return true;
    }
  };

  const filteredTasks = tasks?.filter(task => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || task.categoryId.toString() === categoryFilter;
    const matchesPeriod = filterByPeriod(task);
    return matchesStatus && matchesCategory && matchesPeriod;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Создаем массив из 20 пустых строк
  const emptyLines = Array(20).fill(null);

  return (
    <div className="space-y-4">
      {filteredTasks?.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
      {/* Добавляем пустые строки */}
      {emptyLines.map((_, index) => (
        <div key={`empty-${index}`} className="border-b border-gray-200 py-2 min-h-[2.5rem]" />
      ))}
      {filteredTasks?.length === 0 && (
        <div className="text-center text-gray-500 italic py-8">
          Нет задач для отображения
        </div>
      )}
    </div>
  );
}