import { type ApiRoutes } from '@server/app';
import { hc } from 'hono/client';
import { queryOptions } from '@tanstack/react-query';
import { type CreateExpenseType } from '@server/sharedTypes';

// 型アサーションで型チェックを緩和
const client = hc<ApiRoutes>('/') as any;

export const api = client.api;

async function getCurrentUser() {
  const res = await api.me.$get();
  if (!res.ok) {
    throw new Error('server error');
  }
  const data = await res.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ['get-current-user'],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export async function getAllExpenses() {
  await new Promise(r => setTimeout(r, 3000));
  const res = await api.expenses.$get();
  if (!res.ok) {
    throw new Error('server error');
  }
  const data = await res.json();
  return data;
}

export const getAllExpensesQueryOptions = queryOptions({
  queryKey: ['get-all-expenses'],
  queryFn: getAllExpenses,
  staleTime: 1000 * 60 * 5,
});

export async function createExpense({ value }: { value: CreateExpenseType }) {
  const res = await api.expenses.$post({ json: value });
  if (!res.ok) {
    throw new Error('sever error');
  }

  const newExpense = await res.json();
  return newExpense;
}
