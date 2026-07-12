"use client";

import { useState } from "react";
import { Navigation } from "../../components/Navigation";
import { useBattlePass } from "../../hooks/useBattlePass";

export default function BattlePassPage() {
  const { battlePass, loading, createBattlePass, refresh } = useBattlePass();
  const [isAdmin, setIsAdmin] = useState(false);

  // Form state for creating a new Battle Pass
  const [bpName, setBpName] = useState("");
  const [rewards, setRewards] = useState([
    { step: 5, description: "" },
    { step: 10, description: "" },
    { step: 15, description: "" },
    { step: 20, description: "" },
    { step: 25, description: "" },
    { step: 30, description: "" },
  ]);

  const handleRewardChange = (step: number, desc: string) => {
    setRewards(rewards.map(r => r.step === step ? { ...r, description: desc } : r));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bpName) return;
    const validRewards = rewards.filter(r => r.description.trim() !== "");
    await createBattlePass({ name: bpName, maxSteps: 30, rewards: validRewards });
    setBpName("");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#181615] text-stone-100 p-6 flex items-center justify-center">
        Chargement...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#181615] text-stone-100 p-2 sm:p-6 lg:p-12 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-[1600px] w-full mx-auto space-y-4 sm:space-y-6 md:space-y-12">
        <Navigation />

        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
              Récompenses
            </h1>
            <p className="text-stone-400 text-base sm:text-lg mt-2">
              Complétez vos tâches pour avancer et gagner des cadeaux.
            </p>
          </div>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-sm border border-stone-700 hover:bg-stone-700 transition"
          >
            {isAdmin ? "Vue Utilisateur" : "Vue Admin"}
          </button>
        </header>

        {isAdmin && (
          <div className="bg-[#23201f] border border-orange-900/30 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4 text-orange-400">Administration : Créer un nouveau Battle Pass</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm text-stone-400 mb-1">Nom du Battle Pass</label>
                <input
                  type="text"
                  value={bpName}
                  onChange={(e) => setBpName(e.target.value)}
                  placeholder="Ex: Saison Hiver 2026"
                  className="w-full bg-[#181615] border border-stone-700 rounded-xl px-4 py-2 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-stone-300 font-medium">Récompenses (Laissez vide si aucune)</h3>
                {rewards.map((r) => (
                  <div key={r.step} className="flex items-center gap-3">
                    <span className="bg-stone-800 px-3 py-2 rounded-lg text-sm w-24 text-center font-bold">
                      Palier {r.step}
                    </span>
                    <input
                      type="text"
                      value={r.description}
                      onChange={(e) => handleRewardChange(r.step, e.target.value)}
                      placeholder={r.step === 30 ? "Gros cadeau IRL !" : "Petit cadeau IRL..."}
                      className="flex-1 bg-[#181615] border border-stone-700 rounded-xl px-4 py-2 focus:border-orange-500 outline-none"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-xl font-bold transition"
              >
                Activer ce Battle Pass
              </button>
            </form>
          </div>
        )}

        {!isAdmin && !battlePass && (
          <div className="text-center py-20 text-stone-500">
            Aucun Battle Pass actif pour le moment.
          </div>
        )}

        {!isAdmin && battlePass && (
          <div className="space-y-8">
            <div className="flex items-center justify-between bg-stone-800/50 p-4 rounded-2xl border border-stone-700/50">
              <h2 className="text-xl font-bold text-stone-200">{battlePass.name}</h2>
              <div className="text-right">
                <span className="text-3xl font-black text-orange-400">{battlePass.progress}</span>
                <span className="text-stone-500"> / {battlePass.maxSteps} tâches</span>
              </div>
            </div>

            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {Array.from({ length: battlePass.maxSteps }).map((_, i) => {
                const stepNumber = i + 1;
                const isCompleted = battlePass.progress >= stepNumber;
                const isCurrent = battlePass.progress + 1 === stepNumber;
                const reward = battlePass.rewards?.find(r => r.step === stepNumber);
                const isMajor = stepNumber === battlePass.maxSteps;

                return (
                  <div
                    key={stepNumber}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      isCompleted
                        ? "bg-orange-600/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                        : isCurrent
                        ? "bg-stone-800 border-stone-500 ring-2 ring-stone-400 ring-offset-2 ring-offset-[#181615]"
                        : "bg-[#181615] border-stone-800 opacity-60"
                    } ${isMajor ? "md:col-span-2 row-span-2 min-h-[120px]" : "aspect-square"}`}
                  >
                    <span className={`text-sm font-black ${isCompleted ? 'text-orange-400' : 'text-stone-500'}`}>
                      {stepNumber}
                    </span>

                    {reward && (
                      <div className="mt-2 flex flex-col items-center text-center">
                        <span className={`text-2xl ${isMajor ? 'text-4xl animate-pulse' : ''}`}>
                          {isMajor ? "🏆" : "🎁"}
                        </span>
                        <span className="text-[10px] mt-1 text-stone-300 font-medium leading-tight">
                          {reward.description}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
