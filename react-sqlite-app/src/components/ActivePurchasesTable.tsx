import { useState } from "react";
import { Purchase, SortConfig } from "../types/purchase";
import { calculateRemaining } from "../utils/calculations";
import { SortIcon } from "./SortIcon";
import { DEFAULT_CATEGORIES } from "../types/constants";

type Props = {
  purchases: Purchase[];
  onUpdate: (id: number, p: Partial<Purchase>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onTogglePaid: (p: Purchase, monthStr: string) => Promise<void>;
  onPostpone: (p: Purchase) => Promise<void>;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
};

export const ActivePurchasesTable = ({ purchases, onUpdate, onDelete, onTogglePaid, onPostpone, sortConfig, onSort }: Props) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Purchase>>({});
  const currentMonthStr = new Date().toISOString().slice(0, 7);

  const startEditing = (purchase: Purchase) => {
    setEditingId(purchase.id);
    setEditData({
      ...purchase,
      date: purchase.date ? purchase.date.split("T")[0] : "",
      expectedReceptionDate: purchase.expectedReceptionDate ? purchase.expectedReceptionDate.split("T")[0] : "",
      reimbursementStartDate: purchase.reimbursementStartDate ? purchase.reimbursementStartDate.split("T")[0] : "",
    });
  };

  const handleUpdate = async (id: number) => {
    const finalCategory = editData.category === "Autre" && editData.category ? editData.category : editData.category;
    
    await onUpdate(id, {
      ...editData,
      category: finalCategory,
      price: typeof editData.price === 'string' ? parseFloat(editData.price) : editData.price,
      monthsToPay: typeof editData.monthsToPay === 'string' ? parseInt(editData.monthsToPay, 10) : editData.monthsToPay,
      date: editData.date || undefined,
      expectedReceptionDate: editData.expectedReceptionDate || undefined,
      reimbursementStartDate: editData.reimbursementStartDate || undefined,
      link: editData.link || undefined,
    });
    setEditingId(null);
  };

  if (purchases.length === 0) {
    return (
      <div className="text-stone-500 text-center py-12 border border-dashed border-orange-900/20 rounded-3xl">
        Aucun achat en cours.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-[#23201f] border border-orange-900/20 rounded-3xl shadow-sm">
      <table className="w-full text-left border-collapse whitespace-nowrap text-sm block md:table">
        <thead className="bg-[#181615]/50 text-stone-400 text-[11px] uppercase tracking-wider border-b border-orange-900/20 hidden md:table-header-group">
          <tr>
            <th className="px-4 py-3 font-medium cursor-pointer hover:text-stone-200 transition-colors" onClick={() => onSort('name')}>Nom<SortIcon columnKey="name" config={sortConfig} /></th>
            <th className="px-4 py-3 font-medium cursor-pointer hover:text-stone-200 transition-colors" onClick={() => onSort('category')}>Catégorie<SortIcon columnKey="category" config={sortConfig} /></th>
            <th className="px-4 py-3 font-medium text-right cursor-pointer hover:text-stone-200 transition-colors" onClick={() => onSort('price')}>Total<SortIcon columnKey="price" config={sortConfig} /></th>
            <th className="px-4 py-3 font-medium text-right cursor-pointer hover:text-stone-200 transition-colors" onClick={() => onSort('remaining')}>Reste<SortIcon columnKey="remaining" config={sortConfig} /></th>
            <th className="px-4 py-3 font-medium text-right cursor-pointer hover:text-stone-200 transition-colors" onClick={() => onSort('monthlyPayment')}>Mensualité<SortIcon columnKey="monthlyPayment" config={sortConfig} /></th>
            <th className="px-4 py-3 font-medium text-center cursor-pointer hover:text-stone-200 transition-colors" onClick={() => onSort('progress')}>Progression<SortIcon columnKey="progress" config={sortConfig} /></th>
            <th className="px-4 py-3 font-medium text-center">Pointage</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-800/50 block md:table-row-group">
          {purchases.map((purchase) => {
            const { remaining, monthlyPayment, monthsRemaining } = calculateRemaining(purchase);

            if (editingId === purchase.id) {
              const isCustomCat = editData.category !== undefined && editData.category !== "" && !DEFAULT_CATEGORIES.includes(editData.category) && editData.category !== "Autre";
              return (
                <tr key={purchase.id} className="bg-orange-900/10">
                  <td colSpan={8} className="p-4 whitespace-normal">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 bg-[#181615] border border-orange-900/20 rounded-2xl p-4 shadow-inner">
                      <div className="space-y-2">
                        <label className="text-xs text-stone-400 font-medium">Nom de l'achat</label>
                        <input type="text" value={editData.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full bg-[#23201f] border border-orange-900/20 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none" placeholder="Nom" />
                        <input type="url" value={editData.link || ""} onChange={(e) => setEditData({ ...editData, link: e.target.value })} className="w-full bg-[#23201f] border border-orange-900/20 rounded px-3 py-2 text-xs text-orange-400 focus:ring-1 focus:ring-orange-500 focus:outline-none" placeholder="Lien HTTP..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-stone-400 font-medium">Catégorie</label>
                        <select
                          value={isCustomCat ? "Autre" : (editData.category || "Autre")}
                          onChange={(e) => {
                            if (e.target.value === "Autre") setEditData({ ...editData, category: "" });
                            else setEditData({ ...editData, category: e.target.value });
                          }}
                          className="w-full bg-[#23201f] border border-orange-900/20 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        >
                          {DEFAULT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                          <option value="Autre">Autre</option>
                        </select>
                        {(isCustomCat || editData.category === "" || editData.category === "Autre") && (
                          <input
                            type="text"
                            value={isCustomCat ? editData.category : (editData.category === "Autre" ? "" : (editData.category || ""))}
                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            className="w-full bg-[#23201f] border border-orange-900/20 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none"
                            placeholder="Précisez la catégorie..."
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-stone-400 font-medium">Prix et Mensualités</label>
                        <div className="flex items-center gap-2">
                          <input type="number" value={editData.price || ""} onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })} className="w-full bg-[#23201f] border border-orange-900/20 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none" placeholder="Prix" />
                          <span className="text-sm text-stone-400">€</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="number" value={editData.monthsToPay || ""} onChange={(e) => setEditData({ ...editData, monthsToPay: parseInt(e.target.value, 10) })} className="w-full bg-[#23201f] border border-orange-900/20 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none" placeholder="Mois" />
                          <span className="text-xs text-stone-500 w-8">mois</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <input type="number" min="0" value={editData.skippedMonths || 0} onChange={(e) => setEditData({ ...editData, skippedMonths: parseInt(e.target.value, 10) || 0 })} className="w-full bg-[#23201f] border border-orange-900/20 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none" placeholder="Reportés" />
                          <span className="text-xs text-stone-500 w-8">rep.</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-stone-400 font-medium">Dates</label>
                        <input type="date" value={editData.date || ""} onChange={(e) => setEditData({ ...editData, date: e.target.value })} className="w-full bg-[#23201f] border border-orange-900/20 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none text-stone-300" title="Date d'achat" />
                        <input type="date" value={editData.expectedReceptionDate || ""} onChange={(e) => setEditData({ ...editData, expectedReceptionDate: e.target.value })} className="w-full bg-[#23201f] border border-orange-900/20 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none text-stone-300" title="Date de réception prévue" />
                        <input type="date" value={editData.reimbursementStartDate || ""} onChange={(e) => setEditData({ ...editData, reimbursementStartDate: e.target.value })} className="w-full bg-[#23201f] border border-orange-900/20 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none text-stone-300" title="Début remboursement" />
                      </div>
                      <div className="flex flex-col justify-end gap-2">
                        <button onClick={() => handleUpdate(purchase.id)} className="w-full bg-orange-600 hover:bg-orange-500 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium">Sauvegarder</button>
                        <button onClick={() => setEditingId(null)} className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm px-4 py-2 rounded-lg transition-colors border border-stone-700">Annuler</button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={purchase.id} className="flex flex-wrap md:table-row items-center p-3 md:p-0 hover:bg-stone-800/50 transition-colors border-b border-orange-900/20/50 md:border-none gap-y-3 md:gap-y-0">
                <td className="w-full md:w-auto px-2 md:px-4 py-1 md:py-3 font-medium text-stone-200 flex justify-between items-start md:table-cell block">
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{purchase.name}</span>
                      {purchase.link ? (
                        <a href={purchase.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-6 h-6 bg-[#2a2625] hover:bg-orange-500/20 text-stone-400 hover:text-orange-400 border border-stone-700/50 hover:border-orange-500/30 rounded transition-all" title="Voir le lien">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      ) : (
                        <div className="inline-flex items-center justify-center w-6 h-6 bg-transparent text-stone-700 border border-transparent rounded cursor-not-allowed" title="Aucun lien">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-500 font-normal mt-0.5">
                      {purchase.date && `Acheté le: ${new Date(purchase.date).toLocaleDateString("fr-FR")}`}
                      {purchase.expectedReceptionDate && ` • Réception: ${new Date(purchase.expectedReceptionDate).toLocaleDateString("fr-FR")}`}
                      {purchase.reimbursementStartDate && ` • Début remb.: ${new Date(purchase.reimbursementStartDate).toLocaleDateString("fr-FR")}`}
                    </div>
                  </div>
                  <div className="md:hidden flex gap-4 text-right">
                    <button onClick={() => startEditing(purchase)} className="text-orange-400 hover:text-orange-300 text-xs font-medium">Modif.</button>
                    <button onClick={() => onDelete(purchase.id)} className="text-rose-400 hover:text-rose-300 text-xs font-medium">Suppr.</button>
                  </div>
                </td>
                <td className="hidden md:table-cell px-4 py-3">
                  <span className="bg-stone-800 text-stone-300 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-stone-700">{purchase.category || "Autre"}</span>
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-right text-stone-300">{purchase.price.toFixed(2)} €</td>
                <td className="w-1/3 md:w-auto px-2 md:px-4 py-1 md:py-3 text-left md:text-right font-medium text-orange-400 block md:table-cell">
                  <div className="md:hidden text-[10px] text-stone-500 font-normal uppercase mb-1">Reste</div>
                  {remaining.toFixed(2)} €
                </td>
                <td className="w-1/3 md:w-auto px-2 md:px-4 py-1 md:py-3 text-center md:text-right font-medium text-emerald-400 block md:table-cell">
                  <div className="md:hidden text-[10px] text-stone-500 font-normal uppercase mb-1">Mensualité</div>
                  {monthlyPayment.toFixed(2)} €
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-center text-xs text-stone-400">
                  {purchase.monthsToPay - monthsRemaining} / {purchase.monthsToPay}
                </td>
                <td className="w-1/3 md:w-auto px-2 md:px-4 py-1 md:py-3 text-right md:text-center block md:table-cell">
                  <div className="md:hidden text-[10px] text-transparent mb-1 select-none">-</div>
                  <div className="flex flex-col gap-1 items-end md:items-center">
                    <button
                      onClick={() => onTogglePaid(purchase, currentMonthStr)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors border ${purchase.lastPaidMonth === currentMonthStr
                          ? "bg-emerald-900/30 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/50"
                          : "bg-stone-800 text-stone-400 border-stone-700 hover:bg-stone-700 hover:text-white"
                        }`}
                    >
                      {purchase.lastPaidMonth === currentMonthStr ? "Payé" : "Pointer"}
                    </button>
                    <button
                      onClick={() => onPostpone(purchase)}
                      className="px-2 py-1 rounded text-[10px] font-medium transition-colors border bg-stone-800/50 text-orange-400/80 border-orange-900/30 hover:bg-orange-900/40 hover:text-orange-400"
                      title="Reporter le paiement d'un mois"
                    >
                      Reporter (+1m)
                    </button>
                    {!!purchase.skippedMonths && purchase.skippedMonths > 0 && (
                      <div className="text-[9px] text-stone-500" title={`${purchase.skippedMonths} mois reporté(s)`}>
                        {purchase.skippedMonths} rep.
                      </div>
                    )}
                  </div>
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-right space-x-3">
                  <button onClick={() => startEditing(purchase)} className="text-orange-400 hover:text-orange-300 text-xs font-medium">Modif.</button>
                  <button onClick={() => onDelete(purchase.id)} className="text-rose-400 hover:text-rose-300 text-xs font-medium">Suppr.</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
