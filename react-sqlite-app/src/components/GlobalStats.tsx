import { Purchase } from "../types/purchase";
import { calculateRemaining } from "../utils/calculations";

export const GlobalStats = ({ purchases }: { purchases: Purchase[] }) => {
  let totalEngaged = 0;
  let totalRemaining = 0;
  let totalMonthlyPayment = 0;
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const categoryDetails: Record<string, { totalEngaged: number }> = {};

  purchases.forEach((p) => {
    const { remaining, monthlyPayment } = calculateRemaining(p);
    const isPaidThisMonth = p.lastPaidMonth === currentMonthStr;

    totalEngaged += p.price;
    totalRemaining += remaining;

    if (remaining > 0 && isPaidThisMonth) {
      totalMonthlyPayment += monthlyPayment;
    }

    if (!categoryDetails[p.category]) {
      categoryDetails[p.category] = { totalEngaged: 0 };
    }
    categoryDetails[p.category].totalEngaged += p.price;
  });

  const mainCategory = Object.keys(categoryDetails).length > 0
    ? Object.entries(categoryDetails).sort((a, b) => b[1].totalEngaged - a[1].totalEngaged)[0][0]
    : "-";

  return (
    <section className="bg-[#23201f] border border-orange-900/20 rounded-3xl p-4 sm:p-6 shadow-xl shadow-orange-900/10 mb-6 md:mb-12">
      <h2 className="text-xl font-semibold mb-6">Statistiques Globales</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-stone-400 mb-1">Montant Total Engagé</p>
          <p className="text-2xl font-bold text-stone-100">{totalEngaged.toFixed(2)} €</p>
        </div>
        <div>
          <p className="text-sm text-stone-400 mb-1">Reste à Payer Global</p>
          <p className="text-2xl font-bold text-orange-400">{totalRemaining.toFixed(2)} €</p>
        </div>
        <div>
          <p className="text-sm text-stone-400 mb-1">Mensualités Payées</p>
          <p className="text-2xl font-bold text-emerald-400">{totalMonthlyPayment.toFixed(2)} €</p>
        </div>
        <div>
          <p className="text-sm text-stone-400 mb-1">Catégorie Principale</p>
          <p className="text-lg font-semibold text-stone-200" title={mainCategory}>
            {mainCategory}
          </p>
        </div>
      </div>
    </section>
  );
};
