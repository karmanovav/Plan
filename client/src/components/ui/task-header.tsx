import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/ui/task-form";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  TASK_STATUS_LABELS,
  TASK_CATEGORY_LABELS,
  TIME_PERIOD_LABELS,
  TaskStatus,
  TaskCategory,
  TimePeriod
} from "@/lib/constants";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface TaskHeaderProps {
  onStatusChange: (status: TaskStatus | "all") => void;
  onCategoryChange: (category: TaskCategory | "all") => void;
  onPeriodChange: (period: TimePeriod) => void;
  onDateSelect: (date: Date | undefined) => void;
}

export function TaskHeader({
  onStatusChange,
  onCategoryChange,
  onPeriodChange,
  onDateSelect
}: TaskHeaderProps) {
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
      <Select defaultValue="all" onValueChange={(value) => onCategoryChange(value as TaskCategory | "all")}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Категория" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все категории</SelectItem>
          {Object.entries(TASK_CATEGORY_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-[#8B7355] hover:bg-[#6B5745] text-white ml-auto">
            <Plus className="h-4 w-4 mr-2" />
            Новая задача
          </Button>
        </DialogTrigger>
        <TaskForm />
      </Dialog>
    </div>
  );
}