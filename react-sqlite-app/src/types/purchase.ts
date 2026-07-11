export type Purchase = {
  id: number;
  name: string;
  category: string;
  price: number;
  date: string;
  monthsToPay: number;
  createdAt: string;
  lastPaidMonth?: string | null;
  link?: string | null;
  expectedReceptionDate?: string | null;
  reimbursementStartDate?: string | null;
  skippedMonths?: number;
};

export type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

