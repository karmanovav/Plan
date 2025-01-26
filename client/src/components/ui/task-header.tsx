import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/ui/task-form";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import {
  TASK_STATUS_LABELS,
  TaskStatus,
  TimePeriod,
  TIME_PERIOD_LABELS,
} from "@/lib/constants";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "@db/schema";

interface TaskHeaderProps {
  onStatusChange: (status: TaskStatus | "all") => void;
  onCategoryChange: (category: string) => void;
  onPeriodChange: (period: TimePeriod) => void;
  onDateSelect: (date: Date | undefined) => void;
}

export function TaskHeader({
  onStatusChange,
  onCategoryChange,
  onPeriodChange,
  onDateSelect
}: TaskHeaderProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const createCategory = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Failed to create category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setNewCategoryName("");
      setIsAddingCategory(false);
    },
  });

  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="font-serif text-lg text-gray-600">
        {format(new Date(), "d MMMM yyyy", { locale: ru })}
      </div>
      <Select defaultValue="today" onValueChange={(value) => onPeriodChange(value as TimePeriod)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Период" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(TIME_PERIOD_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <Select 
          defaultValue="all" 
          onValueChange={(value) => {
            if (value === "new") {
              setIsAddingCategory(true);
            } else {
              onCategoryChange(value);
            }
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
            <SelectItem value="new" className="text-primary">
              <Plus className="h-4 w-4 mr-2 inline" />
              Новая категория
            </SelectItem>
          </SelectContent>
        </Select>
        <DialogContent>
          <DialogTitle>Создать новую категорию</DialogTitle>
          <div className="flex gap-2 mt-4">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Название категории"
            />
            <Button 
              onClick={() => createCategory.mutate(newCategoryName)}
              disabled={createCategory.isPending || !newCategoryName}
            >
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Select defaultValue="all" onValueChange={(value) => onStatusChange(value as TaskStatus | "all")}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все статусы</SelectItem>
          {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <TaskForm />
    </div>
  );
}