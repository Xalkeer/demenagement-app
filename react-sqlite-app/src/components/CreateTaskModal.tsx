import { useState, useEffect } from "react";
import { TaskList } from "../types/task";

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  lists: TaskList[];
  defaultListId?: number | "none";
};

export function CreateTaskModal({ isOpen, onClose, onSave, lists, defaultListId = "none" }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'super-urgent'>('normal');
  const [listId, setListId] = useState<number | "none">(defaultListId);
  const [recurrenceMode, setRecurrenceMode] = useState<'none' | 'monthly' | 'days'>('none');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDate(new Date().toISOString().split('T')[0]);
      setPriority("normal");
      setListId(defaultListId);
      setRecurrenceMode("none");
      setSelectedDays([]);
    }
  }, [isOpen, defaultListId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    
    onSave({
      title: title.trim(),
      date: new Date(date).toISOString(),
      listId: listId === "none" ? null : listId,
      priority,
      isCompleted: false,
      recurrence: recurrenceMode === 'days' && selectedDays.length > 0 ? selectedDays.join(',') : recurrenceMode,
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-2 sm:p-4 z-[60]">
      <div className="bg-[#23201f] border border-stone-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar">
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Nouvelle tâche</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-stone-400 mb-1">Titre de la tâche</label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-2 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
              placeholder="Ex: Faire les courses..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-2 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-2 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
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
                onChange={(e) => setListId(e.target.value === "none" ? "none" : parseInt(e.target.value, 10))}
                className="w-full bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-2 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
              >
                <option value="none">Général (Sans liste)</option>
                {lists.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-stone-400 mb-1">Récurrence</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={recurrenceMode}
                  onChange={(e) => setRecurrenceMode(e.target.value as any)}
                  className="bg-[#181615] border border-stone-800 rounded-xl px-3 sm:px-4 py-2 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
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

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-400 hover:bg-stone-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !date}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 text-white font-medium transition-colors"
            >
              Créer la tâche
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
