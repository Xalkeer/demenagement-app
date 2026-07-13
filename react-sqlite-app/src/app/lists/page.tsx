"use client";

import { useState } from "react";
import { Navigation } from "../../components/Navigation";
import { useLists } from "../../hooks/useLists";
import { useTasks } from "../../hooks/useTasks";
import { TaskList, Task } from "../../types/task";
import { TaskModal } from "../../components/TaskModal";
import { CreateTaskModal } from "../../components/CreateTaskModal";

export default function ListsPage() {
  const { lists, loadingLists, addList, deleteList } = useLists();
  const { tasks, loadingTasks, addTask, updateTask, toggleTaskStatus, deleteTask } = useTasks();
  
  const [selectedListId, setSelectedListId] = useState<number | null | "today" | "loading">("loading");
  const [newListName, setNewListName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTaskPriority, setNewTaskPriority] = useState<'normal' | 'urgent' | 'super-urgent'>('normal');
  const [newTaskTargetList, setNewTaskTargetList] = useState<number | "none">("none");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Automatically select the first list once loaded
  if (selectedListId === "loading" && lists.length > 0) {
    setSelectedListId(lists[0].id);
    setNewTaskTargetList(lists[0].id);
  }

  const selectedList = selectedListId !== null && selectedListId !== "today" && selectedListId !== "loading" ? lists.find(l => l.id === selectedListId) : null;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const listTasks = selectedListId === "today"
    ? tasks.filter(t => t.date && t.date.split('T')[0] === todayStr)
    : selectedListId === null 
      ? tasks.filter(t => t.listId === null) 
      : tasks.filter(t => t.listId === selectedList?.id);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const colors = ["orange", "rose", "emerald", "blue", "violet", "amber"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const created = await addList({ name: newListName.trim(), color: randomColor });
    setNewListName("");
    if (created) setSelectedListId(created.id);
  };

  const handleCreateTask = async (data: any) => {
    await addTask(data);
  };

  const getColorClass = (color: string) => {
    const map: Record<string, string> = {
      orange: "bg-orange-900/40 text-orange-400 border-orange-900/50",
      rose: "bg-rose-900/40 text-rose-400 border-rose-900/50",
      emerald: "bg-emerald-900/40 text-emerald-400 border-emerald-900/50",
      blue: "bg-blue-900/40 text-blue-400 border-blue-900/50",
      violet: "bg-violet-900/40 text-violet-400 border-violet-900/50",
      amber: "bg-amber-900/40 text-amber-400 border-amber-900/50",
      stone: "bg-stone-800/40 text-stone-400 border-stone-700/50"
    };
    return map[color] || map.stone;
  };

  return (
    <main className="min-h-screen bg-[#181615] text-stone-100 p-2 sm:p-6 lg:p-12 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-[1600px] w-full mx-auto space-y-4 sm:space-y-6 md:space-y-12">
        <Navigation />
        
        <header className="text-center space-y-3 sm:space-y-5">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            Mes Listes
          </h1>
          <p className="text-stone-400 text-base sm:text-lg">
            Organisez vos tâches et événements par catégorie.
          </p>
        </header>

        {loadingLists || loadingTasks ? (
          <div className="text-stone-500 text-center py-12">Chargement de vos listes...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Colonne gauche : Les listes */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-[#23201f] border border-stone-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl">
                <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 px-2">Vos Listes</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => { setSelectedListId(null); setNewTaskTargetList("none"); }}
                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center justify-between transition-all ${
                      selectedListId === null 
                        ? "bg-stone-800 ring-1 ring-orange-500/50" 
                        : "hover:bg-stone-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full bg-stone-500`}></span>
                      <span className="font-medium text-sm">Général (Sans liste)</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setSelectedListId("today"); setNewTaskTargetList("none"); }}
                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center justify-between transition-all ${
                      selectedListId === "today" 
                        ? "bg-stone-800 ring-1 ring-orange-500/50" 
                        : "hover:bg-stone-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full bg-orange-500`}></span>
                      <span className="font-medium text-sm">Aujourd'hui</span>
                    </div>
                  </button>
                  {lists.map(list => (
                    <button
                      key={list.id}
                      onClick={() => { setSelectedListId(list.id); setNewTaskTargetList(list.id); }}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center justify-between transition-all ${
                        selectedListId === list.id 
                          ? "bg-stone-800 ring-1 ring-orange-500/50" 
                          : "hover:bg-stone-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${getColorClass(list.color).split(' ')[0]}`}></span>
                        <span className="font-medium text-sm">{list.name}</span>
                      </div>
                      {!list.isDefault && (
                        <div
                          onClick={(e) => { e.stopPropagation(); deleteList(list.id); }}
                          className="text-stone-600 hover:text-rose-400 p-1 rounded transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleCreateList} className="mt-6 pt-4 border-t border-stone-800">
                  <input
                    type="text"
                    placeholder="+ Nouvelle liste"
                    value={newListName}
                    onChange={e => setNewListName(e.target.value)}
                    className="w-full bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-stone-600"
                  />
                </form>
              </div>
            </div>

            {/* Box d'affichage de la liste sélectionnée */}
            <div className="lg:col-span-3 space-y-6">
              
              <div className="bg-[#23201f] border border-stone-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-xl min-h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-stone-800">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {selectedListId === "today" ? (
                      <>
                        <span className="w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                        <h2 className="text-xl sm:text-2xl font-bold">Aujourd'hui</h2>
                      </>
                    ) : selectedListId === null ? (
                      <>
                        <span className="w-4 h-4 rounded-full bg-stone-500"></span>
                        <h2 className="text-xl sm:text-2xl font-bold">Général (Sans liste)</h2>
                      </>
                    ) : (
                      <>
                        <span className={`w-4 h-4 rounded-full ${getColorClass(selectedList?.color || 'stone').split(' ')[0]}`}></span>
                        <h2 className="text-xl sm:text-2xl font-bold">{selectedList?.name}</h2>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      setNewTaskTargetList(selectedListId === "today" || selectedListId === null || selectedListId === "loading" ? "none" : selectedListId);
                      setIsCreateModalOpen(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle tâche
                  </button>
                </div>

                <div className="flex-1 space-y-3">
                  {listTasks.length === 0 ? (
                    <div className="text-center text-stone-500 py-12 italic">
                      Aucune tâche dans cette liste.
                    </div>
                  ) : (
                    listTasks.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(task => (
                      <div 
                        key={task.id}
                        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-colors ${
                          task.isCompleted 
                            ? 'bg-stone-800/30 border-stone-800 text-stone-500' 
                            : `bg-[#181615] ${selectedListId === null ? 'border-stone-700/50' : getColorClass(selectedList?.color || 'stone').split(' ')[2]} text-stone-200 hover:bg-stone-800/50`
                        }`}
                      >
                          <input 
                            type="checkbox" 
                            checked={task.isCompleted} 
                            onChange={() => toggleTaskStatus(task)}
                            className="w-5 h-5 rounded border-stone-600 text-orange-500 focus:ring-orange-500 bg-[#23201f] cursor-pointer"
                          />
                          <div className="flex-1 flex justify-between items-center gap-4 cursor-pointer group" onClick={() => setEditingTask(task)}>
                            <div className="flex items-center gap-3 group-hover:text-orange-400 transition-colors">
                              <span className={`font-medium ${task.isCompleted ? 'line-through opacity-70' : ''}`}>
                                {task.title}
                              </span>
                              {task.priority === 'urgent' && (
                                <span className="bg-orange-900/40 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-900/50 uppercase">Urgent</span>
                              )}
                              {task.priority === 'super-urgent' && (
                                <span className="bg-rose-900/40 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-900/50 uppercase">Super Urgent</span>
                              )}
                            </div>
                            <span className="text-sm opacity-60">
                              {new Date(task.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <button 
                            onClick={() => deleteTask(task.id)} 
                            className="text-stone-600 hover:text-rose-400 p-2 rounded transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>

      <TaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={updateTask}
        onDelete={deleteTask}
        lists={lists}
      />
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTask}
        lists={lists}
        defaultListId={newTaskTargetList}
      />
    </main>
  );
}
