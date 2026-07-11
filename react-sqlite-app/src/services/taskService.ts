import { Task } from "../types/task";

const API_URL = "/api";

export const taskService = {
  async fetchAll(): Promise<Task[]> {
    const res = await fetch(`${API_URL}/tasks`);
    if (!res.ok) throw new Error("Erreur de chargement des tâches");
    return res.json();
  },

  async create(data: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la création");
    return res.json();
  },

  async update(id: number, data: Partial<Task>): Promise<void> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour");
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
  },
};
