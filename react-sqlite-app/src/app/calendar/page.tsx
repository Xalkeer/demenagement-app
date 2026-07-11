"use client";

import { usePurchases } from "../../hooks/usePurchases";
import { useTasks } from "../../hooks/useTasks";
import { useLists } from "../../hooks/useLists";
import { Navigation } from "../../components/Navigation";
import { CalendarView } from "../../components/CalendarView";

export default function CalendarPage() {
  const { purchases, loading } = usePurchases();
  const { tasks, loadingTasks, addTask, toggleTaskStatus, deleteTask } = useTasks();
  const { lists, loadingLists } = useLists();

  return (
    <main className="min-h-screen bg-[#181615] text-stone-100 p-3 sm:p-6 lg:p-12 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-[1600px] w-full mx-auto space-y-6 md:space-y-12">
        <Navigation />
        
        <header className="text-center space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            Calendrier
          </h1>
          <p className="text-stone-400 text-lg">
            Visualisez les dates importantes de vos achats.
          </p>
        </header>

        {loading || loadingTasks || loadingLists ? (
          <div className="text-stone-500 text-center py-12">Chargement du calendrier...</div>
        ) : (
          <CalendarView 
            purchases={purchases} 
            tasks={tasks}
            lists={lists}
            onAddTask={addTask}
            onToggleTask={toggleTaskStatus}
            onDeleteTask={deleteTask}
          />
        )}
      </div>
    </main>
  );
}
