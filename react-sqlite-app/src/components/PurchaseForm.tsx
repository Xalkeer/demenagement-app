import { useState } from "react";
import { Purchase } from "../types/purchase";
import { DEFAULT_CATEGORIES } from "../types/constants";

export const PurchaseForm = ({ onAdd }: { onAdd: (p: Partial<Purchase>) => Promise<void> }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Bureau Pierre");
  const [customCategory, setCustomCategory] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [monthsToPay, setMonthsToPay] = useState("");
  const [link, setLink] = useState("");
  const [expectedReceptionDate, setExpectedReceptionDate] = useState("");
  const [reimbursementStartDate, setReimbursementStartDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === "Autre" && customCategory ? customCategory : category;

    await onAdd({
      name,
      category: finalCategory,
      price: parseFloat(price),
      date: date || undefined,
      monthsToPay: parseInt(monthsToPay, 10),
      link: link || undefined,
      expectedReceptionDate: expectedReceptionDate || undefined,
      reimbursementStartDate: reimbursementStartDate || undefined,
    });

    setName("");
    setPrice("");
    setCustomCategory("");
    setCategory("Bureau Pierre");
    setDate(new Date().toISOString().split('T')[0]);
    setMonthsToPay("");
    setLink("");
    setExpectedReceptionDate("");
    setReimbursementStartDate("");
  };

  return (
    <section className="w-full max-w-full bg-[#23201f] border border-orange-900/20 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-xl shrink-0 overflow-hidden">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Nouvel Achat</h2>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-stone-400">Nom de l'achat</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full min-w-0 max-w-full bg-[#181615] border border-orange-900/20 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
            placeholder="Ex: Bureau Pierre"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-stone-400">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full min-w-0 max-w-full bg-[#181615] border border-orange-900/20 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
          >
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {category === "Autre" && (
            <input
              type="text"
              required
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full min-w-0 bg-[#181615] border border-orange-900/20 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
              placeholder="Précisez la catégorie..."
            />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-stone-400">Prix total (€)</label>
          <input
            type="number"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full min-w-0 max-w-full bg-[#181615] border border-orange-900/20 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
            placeholder="Ex: 1200"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-stone-400">Date d'achat</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full min-w-0 max-w-full bg-[#181615] border border-orange-900/20 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow text-stone-200 [color-scheme:dark]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-stone-400">Début remboursement (opt.)</label>
          <input
            type="date"
            value={reimbursementStartDate}
            onChange={(e) => setReimbursementStartDate(e.target.value)}
            className="w-full min-w-0 max-w-full bg-[#181615] border border-orange-900/20 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow text-stone-200 [color-scheme:dark]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-stone-400">Sur combien de mois ?</label>
          <input
            type="number"
            min="1"
            required
            value={monthsToPay}
            onChange={(e) => setMonthsToPay(e.target.value)}
            className="w-full min-w-0 max-w-full bg-[#181615] border border-orange-900/20 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
            placeholder="Ex: 12"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-stone-400">Lien de l'article (optionnel)</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full min-w-0 max-w-full bg-[#181615] border border-orange-900/20 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-stone-400">Date de réception prévue (optionnelle)</label>
          <input
            type="date"
            value={expectedReceptionDate}
            onChange={(e) => setExpectedReceptionDate(e.target.value)}
            className="w-full min-w-0 max-w-full bg-[#181615] border border-orange-900/20 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow text-stone-200 [color-scheme:dark]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 rounded-lg transition-colors mt-2"
        >
          Ajouter
        </button>
      </form>
    </section>
  );
};
