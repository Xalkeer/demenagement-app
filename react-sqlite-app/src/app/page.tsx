"use client";

import { useState } from "react";
import { SortConfig } from "../types/purchase";
import { usePurchases } from "../hooks/usePurchases";
import { sortData } from "../utils/sorting";
import { calculateRemaining } from "../utils/calculations";

// Components
import { Header } from "../components/Header";
import { CategorySummary } from "../components/CategorySummary";
import { PurchaseForm } from "../components/PurchaseForm";
import { ActivePurchasesTable } from "../components/ActivePurchasesTable";
import { PaidPurchasesTable } from "../components/PaidPurchasesTable";
import { GlobalStats } from "../components/GlobalStats";
import { EasterEgg } from "../components/EasterEgg";
import { Navigation } from "../components/Navigation";

export default function Home() {
  const {
    purchases,
    loading,
    addPurchase,
    updatePurchase,
    deletePurchase,
    togglePaidThisMonth,
    postponePurchase,
    exportPurchases,
    importPurchases,
  } = usePurchases();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [sortConfigPaid, setSortConfigPaid] = useState<SortConfig>(null);

  const handleSort = (key: string, isPaidTable = false) => {
    const currentConfig = isPaidTable ? sortConfigPaid : sortConfig;
    const setConfig = isPaidTable ? setSortConfigPaid : setSortConfig;
    let direction: 'asc' | 'desc' = 'asc';
    if (currentConfig && currentConfig.key === key && currentConfig.direction === 'asc') {
      direction = 'desc';
    }
    setConfig({ key, direction });
  };

  const activePurchases = sortData(
    purchases
      .filter((p) => calculateRemaining(p).remaining > 0)
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    sortConfig
  );
  
  const paidPurchases = sortData(
    purchases
      .filter((p) => calculateRemaining(p).remaining <= 0)
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    sortConfigPaid
  );

  return (
    <main className="min-h-screen bg-[#181615] text-stone-100 p-2 sm:p-6 lg:p-12 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-[1600px] w-full mx-auto space-y-4 sm:space-y-6 md:space-y-12">
        <Navigation />
        <Header onExport={exportPurchases} onImport={importPurchases} />

        <GlobalStats purchases={purchases} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-12 items-start">
          <div className="lg:col-span-4 md:col-span-1 space-y-4 sm:space-y-6 min-w-0">
            <PurchaseForm onAdd={addPurchase} />
            <CategorySummary purchases={purchases} />
          </div>

          <section className="lg:col-span-8 md:col-span-2 space-y-6 sm:space-y-8 md:space-y-12 min-w-0">
            {/* SEARCH BAR */}
            <div className="bg-[#23201f] border border-orange-900/20 rounded-2xl p-2 md:p-3 shadow-sm flex items-center gap-3 focus-within:ring-1 focus-within:ring-orange-500 transition-shadow">
              <svg className="w-5 h-5 text-stone-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Rechercher un achat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-0 text-sm md:text-base py-1"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-stone-500 hover:text-stone-300 p-1 mr-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            {/* ACHATS EN COURS */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-3">
                Vos Achats en Cours
                <span className="bg-orange-900/50 text-orange-400 text-xs px-2 py-1 rounded-full font-medium">
                  {activePurchases.length}
                </span>
              </h2>

              {loading ? (
                <div className="text-stone-500 text-center py-12">Chargement...</div>
              ) : (
                <ActivePurchasesTable
                  purchases={activePurchases}
                  onUpdate={updatePurchase}
                  onDelete={deletePurchase}
                  onTogglePaid={togglePaidThisMonth}
                  onPostpone={postponePurchase}
                  sortConfig={sortConfig}
                  onSort={(key) => handleSort(key, false)}
                />
              )}
            </div>

            {/* ACHATS TERMINÉS */}
            {!loading && paidPurchases.length > 0 && (
              <PaidPurchasesTable
                purchases={paidPurchases}
                onUpdate={updatePurchase}
                onDelete={deletePurchase}
                sortConfig={sortConfigPaid}
                onSort={(key) => handleSort(key, true)}
              />
            )}
          </section>
        </div>
      </div>
      
      <EasterEgg />
    </main>
  );
}
