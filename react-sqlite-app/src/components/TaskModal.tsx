import { useState, useEffect } from "react";
import { Task, TaskList } from "../types/task";

type TaskModalProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: Partial<Task>) => void;
  onDelete?: (id: number, mode?: 'single' | 'future' | 'all') => void;
  lists: TaskList[];
};

export function TaskModal({ task, isOpen, onClose, onSave, onDelete, lists }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'super-urgent'>('normal');
  const [listId, setListId] = useState<number | "none">("none");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [assignee, setAssignee] = useState<string>("none");
  const [recurrenceMode, setRecurrenceMode] = useState<'none' | 'monthly' | 'days'>('none');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showRecurrencePrompt, setShowRecurrencePrompt] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDate(task.date.split('T')[0]); // format for input type="date"
      setPriority(task.priority || 'normal');
      setListId(task.listId || "none");
      setDescription(task.description || "");
      setLocation(task.location || "");
      setAssignee(task.assignee || "none");
      
      const rec = task.recurrence || "none";
      if (rec === "none" || rec === "monthly") {
        setRecurrenceMode(rec as any);
        setSelectedDays([]);
      } else if (rec === "daily") {
        setRecurrenceMode("days");
        setSelectedDays(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
      } else if (rec === "weekly") {
        // Fallback for old 'weekly' values - we just pick Monday as an example, but ideally they'll edit it
        setRecurrenceMode("days");
        setSelectedDays(['Lundi']);
      } else {
        setRecurrenceMode("days");
        setSelectedDays(rec.split(','));
      }
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.recurrenceId) {
      setShowRecurrencePrompt(true);
      return;
    }
    submitWithMode('single');
  };

  const submitWithMode = (mode: 'single' | 'future' | 'all') => {
    onSave(task.id, {
      title,
      date: new Date(date).toISOString(),
      priority,
      listId: listId === "none" ? null : listId,
      description: description || null,
      location: location || null,
      assignee: assignee === "none" ? null : assignee,
      recurrence: recurrenceMode === 'days' && selectedDays.length > 0 ? selectedDays.join(',') : recurrenceMode,
      updateMode: mode,
    });
    setShowRecurrencePrompt(false);
    onClose();
  };

  const handleDeleteClick = () => {
    if (task.recurrenceId) {
      setShowDeletePrompt(true);
    } else {
      executeDelete('single');
    }
  };

  const executeDelete = (mode: 'single' | 'future' | 'all') => {
    if (onDelete) {
      onDelete(task.id, mode);
    }
    setShowDeletePrompt(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-2 sm:p-4 z-[60]">
      <div className="bg-[#23201f] border border-stone-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar">
        {showDeletePrompt ? (
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-rose-500">Supprimer la tâche récurrente</h2>
            <p className="text-sm text-stone-400 mb-6">Cette tâche est une occurrence d'une série répétitive. Voulez-vous supprimer :</p>
            <div className="space-y-3">
              <button
                onClick={() => executeDelete('single')}
                className="w-full text-left px-4 py-3 bg-[#181615] hover:bg-rose-950/30 border border-stone-800 hover:border-rose-900/50 rounded-xl transition-colors"
              >
                <div className="font-medium text-rose-400">Juste cette tâche</div>
                <div className="text-xs text-stone-500 mt-1">Les autres occurrences resteront.</div>
              </button>
              <button
                onClick={() => executeDelete('future')}
                className="w-full text-left px-4 py-3 bg-[#181615] hover:bg-rose-950/30 border border-stone-800 hover:border-rose-900/50 rounded-xl transition-colors"
              >
                <div className="font-medium text-rose-400">Cette tâche et les suivantes</div>
                <div className="text-xs text-stone-500 mt-1">Supprime cette occurrence et toutes celles à venir.</div>
              </button>
              <button
                onClick={() => executeDelete('all')}
                className="w-full text-left px-4 py-3 bg-[#181615] hover:bg-rose-950/30 border border-stone-800 hover:border-rose-900/50 rounded-xl transition-colors"
              >
                <div className="font-medium text-rose-400">Toutes les occurrences</div>
                <div className="text-xs text-stone-500 mt-1">Supprime l'ensemble de la série, passée et future.</div>
              </button>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowDeletePrompt(false)}
                className="px-4 py-2 rounded-xl text-stone-400 hover:bg-stone-800 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : showRecurrencePrompt ? (
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-4">Modifier la tâche récurrente</h2>
            <p className="text-sm text-stone-400 mb-6">Cette tâche est une occurrence d'une série répétitive. Voulez-vous modifier :</p>
            <div className="space-y-3">
              <button
                onClick={() => submitWithMode('single')}
                className="w-full text-left px-4 py-3 bg-[#181615] hover:bg-stone-800 border border-stone-800 rounded-xl transition-colors"
              >
                <div className="font-medium">Juste cette tâche</div>
                <div className="text-xs text-stone-500 mt-1">Les autres occurrences resteront inchangées.</div>
              </button>
              <button
                onClick={() => submitWithMode('future')}
                className="w-full text-left px-4 py-3 bg-[#181615] hover:bg-stone-800 border border-stone-800 rounded-xl transition-colors"
              >
                <div className="font-medium">Cette tâche et les suivantes</div>
                <div className="text-xs text-stone-500 mt-1">S'applique à cette occurrence et à toutes celles à venir.</div>
              </button>
              <button
                onClick={() => submitWithMode('all')}
                className="w-full text-left px-4 py-3 bg-[#181615] hover:bg-stone-800 border border-stone-800 rounded-xl transition-colors"
              >
                <div className="font-medium">Toutes les occurrences</div>
                <div className="text-xs text-stone-500 mt-1">Modifie l'ensemble de la série, passée et future.</div>
              </button>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowRecurrencePrompt(false)}
                className="px-4 py-2 rounded-xl text-stone-400 hover:bg-stone-800 transition-colors"
              >
                Retour
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Modifier la tâche</h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
            <label className="block text-sm text-stone-400 mb-1">Titre</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 outline-none focus:border-orange-500/50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 outline-none focus:border-orange-500/50 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent' | 'super-urgent')}
                className="w-full bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 outline-none focus:border-orange-500/50"
              >
                <option value="normal">Normale</option>
                <option value="urgent">Urgente</option>
                <option value="super-urgent">Très urgente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Liste</label>
              <select
                value={listId}
                onChange={(e) => setListId(e.target.value === "none" ? "none" : parseInt(e.target.value))}
                className="w-full bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 outline-none focus:border-orange-500/50"
              >
                <option value="none">Aucune liste</option>
                {lists.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Assigné à</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 outline-none focus:border-orange-500/50"
              >
                <option value="none">Non assigné</option>
                <option value="Pierre">Pierre</option>
                <option value="Lau">Lau</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Lieu</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Supermarché, Bureau..."
                className="w-full bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 outline-none focus:border-orange-500/50"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-stone-400 mb-1">Récurrence</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={recurrenceMode}
                  onChange={(e) => setRecurrenceMode(e.target.value as any)}
                  className="bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 outline-none focus:border-orange-500/50"
                >
                  <option value="none">Aucune</option>
                  <option value="days">Jours spécifiques</option>
                  <option value="monthly">Mensuelle</option>
                </select>
                
                {recurrenceMode === 'days' && (
                  <div className="flex gap-1.5 flex-wrap">
                    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedDays(selectedDays.filter(d => d !== day));
                            } else {
                              setSelectedDays([...selectedDays, day]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                            isSelected 
                              ? 'bg-orange-600 text-white' 
                              : 'bg-[#181615] border border-stone-800 text-stone-400 hover:bg-stone-800'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Détails supplémentaires..."
              className="w-full bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 outline-none focus:border-orange-500/50 resize-none"
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <div>
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-rose-400 hover:bg-rose-950/30 transition-colors font-medium text-sm"
                >
                  Supprimer
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-stone-400 hover:bg-stone-800 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
}
