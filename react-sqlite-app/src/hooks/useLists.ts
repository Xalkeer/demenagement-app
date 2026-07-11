import { useState, useEffect, useCallback } from "react";
import { TaskList } from "../types/task";
import { listService } from "../services/listService";

export function useLists() {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLists = useCallback(async () => {
    try {
      const data = await listService.fetchAll();
      setLists(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const addList = async (listData: Partial<TaskList>) => {
    try {
      const newList = await listService.create(listData);
      setLists(prev => [...prev, newList]);
      return newList;
    } catch (error) {
      console.error(error);
    }
  };

  const updateList = async (id: number, data: Partial<TaskList>) => {
    try {
      await listService.update(id, data);
      setLists(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
    } catch (error) {
      console.error(error);
      fetchLists();
    }
  };

  const deleteList = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette liste ? Les tâches associées perdront leur liste.")) return;
    try {
      await listService.delete(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return {
    lists,
    loadingLists: loading,
    addList,
    updateList,
    deleteList,
    refreshLists: fetchLists,
  };
}
