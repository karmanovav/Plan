import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task } from "@db/schema";
import { TASK_STATUS_LABELS, TaskStatus } from "@/lib/constants";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Circle, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: async (newStatus: TaskStatus) => {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const statusIcon = {
    created: <Circle className="h-4 w-4" />,
    in_progress: <PlayCircle className="h-4 w-4" />,
    completed: <CheckCircle className="h-4 w-4" />,
  };

  return (
    <Card className="mb-4 transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-1">{task.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {format(new Date(task.dueDate), "d MMMM yyyy", { locale: ru })}
              </Badge>
              <Badge 
                variant="secondary"
                className={cn(
                  "text-xs",
                  task.status === "completed" && "bg-green-100",
                  task.status === "in_progress" && "bg-blue-100"
                )}
              >
                {TASK_STATUS_LABELS[task.status as TaskStatus]}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            {task.status !== "in_progress" && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => updateStatus.mutate("in_progress")}
                disabled={updateStatus.isPending}
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                Начать
              </Button>
            )}
            {task.status !== "completed" && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => updateStatus.mutate("completed")}
                disabled={updateStatus.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Завершить
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
