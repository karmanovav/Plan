import { TaskCard } from "@/components/ui/task-card";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@db/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TASK_STATUS_LABELS, TaskStatus } from "@/lib/constants";
import { useState } from "react";

export function TaskList() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  const filteredTasks = tasks?.filter(task => 
    statusFilter === "all" ? true : task.status === statusFilter
  ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select
          defaultValue="all"
          onValueChange={(value) => setStatusFilter(value as TaskStatus | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все задачи</SelectItem>
            {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        {filteredTasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {filteredTasks?.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Нет задач для отображения
          </div>
        )}
      </div>
    </div>
  );
}
