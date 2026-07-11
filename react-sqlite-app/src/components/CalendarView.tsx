import { useState } from "react";
import { Purchase } from "../types/purchase";
import { Task, TaskList } from "../types/task";

type CalendarProps = {
  purchases: Purchase[];
  tasks: Task[];
  lists?: TaskList[];
  onAddTask: (task: Partial<Task>) => Promise<void>;
  onToggleTask: (task: Task) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
};

export const CalendarView = ({ purchases, tasks, lists = [], onAddTask, onToggleTask, onDeleteTask }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [addingTaskDate, setAddingTaskDate] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Lundi = 0, Dimanche = 6
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Regrouper les événements par jour
  const eventsByDay: Record<number, { type: 'purchase' | 'reception' | 'start-pay', purchase: Purchase }[]> = {};

  purchases.forEach(p => {
    if (p.date) {
      const d = new Date(p.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        if (!eventsByDay[d.getDate()]) eventsByDay[d.getDate()] = [];
        eventsByDay[d.getDate()].push({ type: 'purchase', purchase: p });
      }
    }
    if (p.expectedReceptionDate) {
      const d = new Date(p.expectedReceptionDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        if (!eventsByDay[d.getDate()]) eventsByDay[d.getDate()] = [];
        eventsByDay[d.getDate()].push({ type: 'reception', purchase: p });
      }
    }
    if (p.reimbursementStartDate) {
      const d = new Date(p.reimbursementStartDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        if (!eventsByDay[d.getDate()]) eventsByDay[d.getDate()] = [];
        eventsByDay[d.getDate()].push({ type: 'start-pay', purchase: p });
      }
    }
  });

  const tasksByDay: Record<number, Task[]> = {};
  tasks?.forEach(t => {
    if (t.date) {
      const d = new Date(t.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        if (!tasksByDay[d.getDate()]) tasksByDay[d.getDate()] = [];
        tasksByDay[d.getDate()].push(t);
      }
    }
  });

  const handleAddTask = async (day: number) => {
    if (!newTaskTitle.trim()) {
      setAddingTaskDate(null);
      return;
    }
    const d = new Date(year, month, day, 12, 0, 0); // midi pour éviter les problèmes de fuseau
    await onAddTask({
      title: newTaskTitle.trim(),
      date: d.toISOString(),
      isCompleted: false
    });
    setNewTaskTitle("");
    setAddingTaskDate(null);
  };

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const getEventStyle = (type: string) => {
    if (type === 'purchase') return "bg-orange-900/40 text-orange-400 border-orange-900/50";
    if (type === 'reception') return "bg-emerald-900/40 text-emerald-400 border-emerald-900/50";
    if (type === 'start-pay') return "bg-blue-900/40 text-blue-400 border-blue-900/50";
    return "";
  };
  
  const getListColorStyle = (listId?: number | null) => {
    if (!listId || !lists) return "border-stone-700/50 text-stone-300";
    const list = lists.find(l => l.id === listId);
    if (!list) return "border-stone-700/50 text-stone-300";
    
    const colorMap: Record<string, string> = {
      orange: "border-orange-900/50 text-orange-400",
      rose: "border-rose-900/50 text-rose-400",
      emerald: "border-emerald-900/50 text-emerald-400",
      blue: "border-blue-900/50 text-blue-400",
      violet: "border-violet-900/50 text-violet-400",
      amber: "border-amber-900/50 text-amber-400"
    };
    return colorMap[list.color] || "border-stone-700/50 text-stone-300";
  };

  const getEventLabel = (type: string) => {
    if (type === 'purchase') return "Achat";
    if (type === 'reception') return "Récep.";
    if (type === 'start-pay') return "Remb.";
    return "";
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="bg-[#23201f] border border-orange-900/20 rounded-3xl p-6 shadow-xl w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-stone-100 flex items-center gap-3">
          {monthNames[month]} <span className="text-orange-500">{year}</span>
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 bg-[#181615] rounded-xl border border-stone-800 hover:bg-stone-800 transition-colors text-stone-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={goToday} className="px-4 py-2 bg-[#181615] rounded-xl border border-stone-800 hover:bg-stone-800 transition-colors text-stone-300 text-sm font-medium">
            Aujourd'hui
          </button>
          <button onClick={nextMonth} className="p-2 bg-[#181615] rounded-xl border border-stone-800 hover:bg-stone-800 transition-colors text-stone-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-stone-800/50 rounded-2xl overflow-hidden border border-stone-800/50">
        {dayNames.map(day => (
          <div key={day} className="bg-[#181615] p-3 text-center text-xs font-semibold text-stone-500 uppercase tracking-wider">
            {day}
          </div>
        ))}

        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="bg-[#23201f] p-2 min-h-[120px]"></div>
        ))}

        {days.map(day => {
          const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
          const events = eventsByDay[day] || [];
          const dayTasks = tasksByDay[day] || [];
          const isAdding = addingTaskDate === day;

          return (
            <div 
              key={day} 
              onClick={() => setSelectedDay(day)}
              className="bg-[#23201f] p-2 h-[130px] overflow-hidden transition-colors hover:bg-stone-800/40 group relative flex flex-col cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-stone-400'}`}>
                  {day}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setAddingTaskDate(day); setNewTaskTitle(""); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-500 hover:text-orange-400 p-1"
                  title="Ajouter une tâche"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
              
              <div className="space-y-1.5 flex flex-col items-start w-full flex-1">
                {events.map((evt, idx) => (
                  <div key={`evt-${idx}`} className={`w-full text-left px-2 py-1 rounded text-[10px] font-medium border truncate ${getEventStyle(evt.type)}`} title={`${getEventLabel(evt.type)} : ${evt.purchase.name}`}>
                    <span className="font-bold opacity-75 mr-1">{getEventLabel(evt.type)}</span>
                    {evt.purchase.name}
                  </div>
                ))}

                {dayTasks.map(t => {
                  const listStyle = getListColorStyle(t.listId);
                  return (
                    <div key={`task-${t.id}`} className={`w-full flex items-start gap-1.5 px-2 py-1 rounded text-[10px] font-medium border ${t.isCompleted ? 'bg-stone-800/30 text-stone-500 line-through border-stone-800' : `bg-stone-800/60 ${listStyle}`}`}>
                      <input 
                        type="checkbox" 
                        checked={t.isCompleted} 
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => onToggleTask(t)}
                        className="mt-0.5 w-3 h-3 rounded-sm border-stone-600 text-orange-500 focus:ring-orange-500 bg-[#181615] cursor-pointer"
                      />
                      <div className="flex-1 min-w-0 flex flex-col items-start">
                        <span className="truncate w-full" title={t.title}>{t.title}</span>
                        {t.priority === 'urgent' && <span className="text-[8px] bg-orange-900/50 text-orange-400 px-1 rounded uppercase mt-0.5 font-bold">Urgent</span>}
                        {t.priority === 'super-urgent' && <span className="text-[8px] bg-rose-900/50 text-rose-400 px-1 rounded uppercase mt-0.5 font-bold">Super Urgent</span>}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteTask(t.id); }} 
                        className="opacity-0 group-hover:opacity-100 text-stone-500 hover:text-rose-400"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  );
                })}

                {isAdding && (
                  <div className="w-full mt-1" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="text" 
                      autoFocus
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => { if(e.key === 'Enter') handleAddTask(day); if(e.key === 'Escape') setAddingTaskDate(null); }}
                      onBlur={() => handleAddTask(day)}
                      placeholder="Nouvelle tâche..."
                      className="w-full text-[10px] bg-[#181615] border border-orange-500/50 rounded px-2 py-1 text-stone-200 outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-900/40 border border-orange-900/50 block"></span>Achat effectué</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-900/40 border border-emerald-900/50 block"></span>Réception prévue</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-900/40 border border-blue-900/50 block"></span>Début du remboursement</div>
        <div className="flex items-center gap-2 ml-auto text-stone-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Cliquez sur un jour pour voir tout son contenu
        </div>
      </div>

      {selectedDay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#181615] border border-stone-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setSelectedDay(null)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-300 bg-stone-800/50 p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold mb-6 text-stone-100 border-b border-stone-800 pb-4">
              Détails du {selectedDay} {monthNames[month]} {year}
            </h3>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {(() => {
                const dayEvents = eventsByDay[selectedDay] || [];
                const dayTasks = tasksByDay[selectedDay] || [];
                
                if (dayEvents.length === 0 && dayTasks.length === 0) {
                  return <p className="text-stone-500 italic text-center py-4">Aucun événement ce jour-là.</p>;
                }

                return (
                  <>
                    {dayEvents.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase font-bold text-stone-500 tracking-wider">Événements</h4>
                        {dayEvents.map((evt, idx) => (
                          <div key={idx} className={`w-full text-left px-3 py-2 rounded text-sm font-medium border ${getEventStyle(evt.type)}`}>
                            <span className="font-bold opacity-75 mr-2">{getEventLabel(evt.type)}</span>
                            {evt.purchase.name}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {dayTasks.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h4 className="text-xs uppercase font-bold text-stone-500 tracking-wider">Tâches</h4>
                        {dayTasks.map(t => {
                          const listStyle = getListColorStyle(t.listId);
                          return (
                            <div key={t.id} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium border ${t.isCompleted ? 'bg-stone-800/30 text-stone-500 line-through border-stone-800' : `bg-stone-800/60 ${listStyle}`}`}>
                              <input 
                                type="checkbox" 
                                checked={t.isCompleted} 
                                onChange={() => onToggleTask(t)}
                                className="w-4 h-4 rounded border-stone-600 text-orange-500 focus:ring-orange-500 bg-[#181615] cursor-pointer"
                              />
                              <div className="flex-1 flex items-center gap-3">
                                <span>{t.title}</span>
                                {t.priority === 'urgent' && <span className="text-[10px] bg-orange-900/50 text-orange-400 px-2 py-0.5 rounded uppercase font-bold border border-orange-900/50">Urgent</span>}
                                {t.priority === 'super-urgent' && <span className="text-[10px] bg-rose-900/50 text-rose-400 px-2 py-0.5 rounded uppercase font-bold border border-rose-900/50">Super Urgent</span>}
                              </div>
                              <button onClick={() => onDeleteTask(t.id)} className="text-stone-500 hover:text-rose-400 p-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
