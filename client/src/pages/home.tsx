import { TaskHeader } from "@/components/ui/task-header";
import { TaskList } from "@/components/ui/task-list";
import { useState } from "react";
import { TaskStatus, TaskCategory, TimePeriod } from "@/lib/constants";

export default function Home() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | "all">("all");
  const [periodFilter, setPeriodFilter] = useState<TimePeriod>("today");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="min-h-screen bg-[#FAF6F1] py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-sm shadow-md p-8">
          <TaskHeader
            onStatusChange={setStatusFilter}
            onCategoryChange={setCategoryFilter}
            onPeriodChange={setPeriodFilter}
            onDateSelect={setSelectedDate}
          />
          <div className="divide-y divide-gray-200">
            <TaskList
              statusFilter={statusFilter}
              categoryFilter={categoryFilter}
              periodFilter={periodFilter}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}