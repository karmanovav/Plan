import { TaskForm } from "@/components/ui/task-form";
import { TaskList } from "@/components/ui/task-list";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF6F1] py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-sm shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif text-[#4A3C31]">Дата</h1>
            <TaskForm />
          </div>
          <div className="divide-y divide-gray-200">
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
}