import { TaskForm } from "@/components/ui/task-form";
import { TaskList } from "@/components/ui/task-list";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif mb-2 text-[#4A3C31]">Задачи на год</h1>
          <p className="text-muted-foreground">Планируйте и достигайте своих целей</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-[#4A3C31]">Мои задачи</h2>
            <TaskForm />
          </div>
          <TaskList />
        </div>
      </div>
    </div>
  );
}
