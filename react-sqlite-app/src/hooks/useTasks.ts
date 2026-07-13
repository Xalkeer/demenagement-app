import { useState, useEffect, useCallback } from "react";
import { Task } from "../types/task";
import { taskService } from "../services/taskService";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await taskService.fetchAll();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (task: Partial<Task>) => {
    try {
      const newTask = await taskService.create(task);
      setTasks(prev => [...prev, newTask]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (id: number, data: Partial<Task>) => {
    try {
      await taskService.update(id, data);
      if (data.updateMode && data.updateMode !== 'single') {
        // Rafraîchir toutes les tâches si on a modifié plusieurs occurrences
        fetchTasks();
      } else {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
      }
    } catch (error) {
      console.error(error);
      fetchTasks();
    }
  };

  const deleteTask = async (id: number, mode?: string) => {
    if (!mode && !confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;
    try {
      await taskService.delete(id, mode);
      if (mode && mode !== 'single') {
        fetchTasks();
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error(error);
      fetchTasks();
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = !task.isCompleted;
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, isCompleted: newStatus } : t));
    try {
      await taskService.update(task.id, { isCompleted: newStatus });
    } catch (err) {
      console.error(err);
      fetchTasks(); // revert on error
    }
  };

  return {
    tasks,
    loadingTasks: loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };
}
