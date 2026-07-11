import { useState, useEffect, useCallback } from "react";
import { Purchase } from "../types/purchase";
import { purchaseService } from "../services/purchaseService";

export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = useCallback(async () => {
    try {
      const data = await purchaseService.fetchAll();
      setPurchases(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const addPurchase = async (purchase: Partial<Purchase>) => {
    try {
      await purchaseService.create(purchase);
      await fetchPurchases();
    } catch (error) {
      console.error(error);
    }
  };

  const updatePurchase = async (id: number, data: Partial<Purchase>) => {
    try {
      await purchaseService.update(id, data);
      await fetchPurchases();
    } catch (error) {
      console.error(error);
    }
  };

  const deletePurchase = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet achat ?")) return;
    try {
      await purchaseService.delete(id);
      setPurchases((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const togglePaidThisMonth = async (purchase: Purchase, currentMonthStr: string) => {
    const isPaidThisMonth = purchase.lastPaidMonth === currentMonthStr;
    const newLastPaidMonth = isPaidThisMonth ? null : currentMonthStr;

    // Optimistic update
    setPurchases((prev) => prev.map(p => p.id === purchase.id ? { ...p, lastPaidMonth: newLastPaidMonth } : p));
    try {
      await purchaseService.update(purchase.id, { lastPaidMonth: newLastPaidMonth });
    } catch (err) {
      console.error(err);
      fetchPurchases(); // Revert
    }
  };

  const postponePurchase = async (purchase: Purchase) => {
    const newSkipped = (purchase.skippedMonths || 0) + 1;
    setPurchases((prev) => prev.map(p => p.id === purchase.id ? { ...p, skippedMonths: newSkipped } : p));
    try {
      await purchaseService.update(purchase.id, { skippedMonths: newSkipped });
    } catch (err) {
      console.error(err);
      fetchPurchases();
    }
  };

  const importPurchases = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm("Attention, l'importation remplacera TOUTES vos données actuelles. Voulez-vous continuer ?")) {
      e.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await purchaseService.importData(data);
      alert("Importation réussie !");
      await fetchPurchases();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'importation");
    }
  };

  return {
    purchases,
    loading,
    addPurchase,
    updatePurchase,
    deletePurchase,
    togglePaidThisMonth,
    postponePurchase,
    exportPurchases: purchaseService.export,
    importPurchases,
  };
}
