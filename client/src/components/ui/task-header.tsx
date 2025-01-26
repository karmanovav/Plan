import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/ui/task-form";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  TASK_STATUS_LABELS,
  TASK_CATEGORY_LABELS,
  TIME_PERIOD_LABELS,
  TaskStatus,
  TaskCategory,
  TimePeriod
} from "@/lib/constants";

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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={new Date()}
            onSelect={onDateSelect}
            locale={ru}
          />
        </PopoverContent>
      </Popover>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Новая задача
          </Button>
        </DialogTrigger>
        <TaskForm />
      </Dialog>
    </div>
  );
}
