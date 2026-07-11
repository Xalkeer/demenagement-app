import { Purchase } from "../types/purchase";

const API_URL = "/api";

export const purchaseService = {
  async fetchAll(): Promise<Purchase[]> {
    const res = await fetch(`${API_URL}/purchases`);
    if (!res.ok) throw new Error("Erreur de chargement des achats");
    return res.json();
  },

  async create(data: Partial<Purchase>): Promise<void> {
    const res = await fetch(`${API_URL}/purchases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la création");
  },

  async update(id: number, data: Partial<Purchase>): Promise<void> {
    const res = await fetch(`${API_URL}/purchases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour");
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/purchases/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
  },

  async export(): Promise<void> {
    const res = await fetch(`${API_URL}/purchases`);
    if (!res.ok) throw new Error("Failed to export data");
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `achats_export_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async importData(data: any): Promise<void> {
    const res = await fetch(`${API_URL}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Erreur lors de l'importation");
  }
};
