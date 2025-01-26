import { TaskCard } from "@/components/ui/task-card";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@db/schema";
import { format, isToday, isThisWeek, isThisMonth, isThisYear } from "date-fns";
import { ru } from "date-fns/locale";
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
  const { data: tasks, isLoading } = useQuery<Task[]>({
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
    const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;
    const matchesPeriod = filterByPeriod(task);
    return matchesStatus && matchesCategory && matchesPeriod;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-2 pt-4">
      <div className="text-right mb-6 font-serif italic text-gray-600">
        {format(new Date(), "d MMMM yyyy", { locale: ru })}
      </div>
      <div className="space-y-4">
        {filteredTasks?.map((task) => (
          <div key={task.id} className="border-b border-gray-200 py-2">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center">
                {task.status === "completed" && "✓"}
              </div>
              <div>
                <div className="font-medium">{task.title}</div>
                {task.description && (
                  <div className="text-sm text-gray-600">{task.description}</div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredTasks?.length === 0 && (
          <div className="text-center text-gray-500 italic py-8">
            Нет задач для отображения
          </div>
        )}
      </div>
    </div>
  );
}