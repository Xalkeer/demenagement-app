import { Purchase, SortConfig } from "../types/purchase";
import { calculateRemaining } from "./calculations";

export const sortData = (data: Purchase[], config: SortConfig) => {
  if (!config) return data;
  return [...data].sort((a, b) => {
    let valA: any = a[config.key as keyof Purchase];
    let valB: any = b[config.key as keyof Purchase];

    if (config.key === 'remaining' || config.key === 'monthlyPayment' || config.key === 'progress') {
      const calcA = calculateRemaining(a);
      const calcB = calculateRemaining(b);
      if (config.key === 'remaining') { valA = calcA.remaining; valB = calcB.remaining; }
      if (config.key === 'monthlyPayment') { valA = calcA.monthlyPayment; valB = calcB.monthlyPayment; }
      if (config.key === 'progress') { valA = calcA.monthsRemaining; valB = calcB.monthsRemaining; }
    }

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA === null || valA === undefined) valA = '';
    if (valB === null || valB === undefined) valB = '';

    if (valA < valB) return config.direction === 'asc' ? -1 : 1;
    if (valA > valB) return config.direction === 'asc' ? 1 : -1;
    return 0;
  });
};
