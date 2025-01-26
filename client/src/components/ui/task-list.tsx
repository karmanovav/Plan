import { TaskCard } from "@/components/ui/task-card";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@db/schema";
import { format, isToday } from "date-fns";
import { ru } from "date-fns/locale";

export function TaskList() {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  const todayTasks = tasks?.filter(task => 
    isToday(new Date(task.dueDate))
  ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-2 pt-4">
      <div className="text-right mb-6 font-serif italic text-gray-600">
        {format(new Date(), "d MMMM yyyy", { locale: ru })}
      </div>
      <div className="space-y-4">
        {todayTasks?.map((task) => (
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
        {todayTasks?.length === 0 && (
          <div className="text-center text-gray-500 italic py-8">
            Нет задач на сегодня
          </div>
        )}
      </div>
    </div>
  );
}