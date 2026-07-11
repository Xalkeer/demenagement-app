import { useState, useEffect } from "react";
import { Task, TaskList } from "../types/task";

type TaskModalProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: Partial<Task>) => void;
  lists: TaskList[];
};

export function TaskModal({ task, isOpen, onClose, onSave, lists }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'super-urgent'>('normal');
  const [listId, setListId] = useState<number | "none">("none");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [assignee, setAssignee] = useState<string>("none");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDate(task.date.split('T')[0]); // format for input type="date"
      setPriority(task.priority || 'normal');
      setListId(task.listId || "none");
      setDescription(task.description || "");
      setLocation(task.location || "");
      setAssignee(task.assignee || "none");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(task.id, {
      title,
      date: new Date(date).toISOString(),
      priority,
      listId: listId === "none" ? null : listId,
      description: description || null,
      location: location || null,
      assignee: assignee === "none" ? null : assignee,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-2 sm:p-4 z-[60]">
      <div className="bg-[#23201f] border border-stone-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar">
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

          <div className="flex justify-end space-x-3 pt-4">
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
        </form>
      </div>
    </div>
  );
}
