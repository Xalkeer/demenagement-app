import { TaskList } from "../types/task";

const API_URL = "/api";

export const listService = {
  async fetchAll(): Promise<TaskList[]> {
    const res = await fetch(`${API_URL}/lists`);
    if (!res.ok) throw new Error("Erreur de chargement des listes");
    return res.json();
  },

  async create(data: Partial<TaskList>): Promise<TaskList> {
    const res = await fetch(`${API_URL}/lists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la création");
    return res.json();
  },

  async update(id: number, data: Partial<TaskList>): Promise<void> {
    const res = await fetch(`${API_URL}/lists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour");
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/lists/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
  },
};
