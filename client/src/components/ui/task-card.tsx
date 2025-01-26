import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@db/schema";
import { TASK_STATUS_LABELS, TaskStatus } from "@/lib/constants";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Circle, Edit2, PlayCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TaskCardProps {
  task: Task & { categoryName?: string };
}

export function TaskCard({ task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || "");
  const [editedDueDate, setEditedDueDate] = useState<Date>(new Date(task.dueDate));

  const queryClient = useQueryClient();

  const updateTask = useMutation({
    mutationFn: async (updateData: Partial<Task>) => {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error("Failed to update task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsEditing(false);
    },
  });

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

  const deleteTask = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const handleSaveEdit = () => {
    updateTask.mutate({
      title: editedTitle,
      description: editedDescription,
      dueDate: editedDueDate,
    });
  };

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
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center">
                {task.status === "completed" && "✓"}
              </div>
              <h3 className="font-medium text-lg">{task.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => deleteTask.mutate()}
                disabled={deleteTask.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
            <div className="flex items-center gap-2 mt-2">
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
              {task.categoryName && (
                <Badge variant="outline" className="text-xs">
                  {task.categoryName}
                </Badge>
              )}
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

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogTitle>Редактировать задачу</DialogTitle>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Название</label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Описание</label>
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Срок выполнения</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {format(editedDueDate, "d MMMM yyyy", { locale: ru })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editedDueDate}
                    onSelect={(date) => date && setEditedDueDate(date)}
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button
              onClick={handleSaveEdit}
              className="w-full"
              disabled={updateTask.isPending}
            >
              Сохранить изменения
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}