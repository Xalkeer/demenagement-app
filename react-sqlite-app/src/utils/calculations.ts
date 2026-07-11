import { Purchase } from "../types/purchase";

export const calculateRemaining = (purchase: Purchase) => {
  const monthlyPayment = purchase.price / purchase.monthsToPay;

  if (!purchase.reimbursementStartDate) {
    return { remaining: purchase.price, monthlyPayment, monthsRemaining: purchase.monthsToPay };
  }

  const startDate = new Date(purchase.reimbursementStartDate);
  const currentDate = new Date();

  const monthDiff =
    (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
    (currentDate.getMonth() - startDate.getMonth());

  const monthsPassedRaw = Math.max(0, monthDiff);
  const skipped = purchase.skippedMonths || 0;
  const monthsPassed = Math.max(0, monthsPassedRaw - skipped);

  if (monthsPassed >= purchase.monthsToPay) {
    return { remaining: 0, monthlyPayment, monthsRemaining: 0 };
  }

  const amountPaid = monthsPassed * monthlyPayment;
  const remaining = purchase.price - amountPaid;
  const monthsRemaining = purchase.monthsToPay - monthsPassed;

  return { remaining, monthlyPayment, monthsRemaining };
};
