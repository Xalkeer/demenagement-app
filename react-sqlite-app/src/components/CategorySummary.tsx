import { Purchase } from "../types/purchase";
import { calculateRemaining } from "../utils/calculations";

export const CategorySummary = ({ purchases }: { purchases: Purchase[] }) => {
  const categoryDetails: Record<string, { totalEngaged: number, totalRemaining: number, monthlyPayment: number, count: number }> = {};
  const currentMonthStr = new Date().toISOString().slice(0, 7);

  purchases.forEach((p) => {
    const { remaining, monthlyPayment } = calculateRemaining(p);
    const isPaidThisMonth = p.lastPaidMonth === currentMonthStr;

    if (!categoryDetails[p.category]) {
      categoryDetails[p.category] = { totalEngaged: 0, totalRemaining: 0, monthlyPayment: 0, count: 0 };
    }

    categoryDetails[p.category].totalEngaged += p.price;
    categoryDetails[p.category].totalRemaining += remaining;

    if (remaining > 0 && isPaidThisMonth) {
      categoryDetails[p.category].monthlyPayment += monthlyPayment;
    }
    categoryDetails[p.category].count += 1;
  });

  return (
    <section className="bg-[#23201f] border border-orange-900/20 rounded-3xl shadow-xl overflow-hidden shrink-0">
      <div className="p-4 border-b border-orange-900/20 bg-[#181615]/50">
        <h2 className="text-base font-semibold text-stone-200">Récapitulatif (par catégorie)</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap text-sm xl:text-base">
          <thead className="bg-[#23201f] text-stone-400 uppercase tracking-wider text-xs xl:text-sm">
            <tr>
              <th className="px-4 py-3 font-medium border-b border-orange-900/20">Cat</th>
              <th className="px-3 py-3 font-medium text-right border-b border-orange-900/20">Nb</th>
              <th className="px-3 py-3 font-medium text-right border-b border-orange-900/20">Engagé</th>
              <th className="px-3 py-3 font-medium text-right border-b border-orange-900/20">Reste</th>
              <th className="px-4 py-3 font-medium text-right border-b border-orange-900/20">Payé</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/50">
            {Object.entries(categoryDetails)
              .sort((a, b) => b[1].totalEngaged - a[1].totalEngaged)
              .map(([cat, stats]) => (
                <tr key={cat} className="hover:bg-stone-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-stone-300 truncate max-w-[120px]" title={cat}>{cat}</td>
                  <td className="px-3 py-3 text-right text-stone-500">{stats.count}</td>
                  <td className="px-3 py-3 text-right text-stone-400">{Math.round(stats.totalEngaged)}€</td>
                  <td className="px-3 py-3 text-right text-orange-400 font-medium">{Math.round(stats.totalRemaining)}€</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-medium">{Math.round(stats.monthlyPayment)}€</td>
                </tr>
              ))}
            {Object.keys(categoryDetails).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-stone-500">Aucune donnée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
