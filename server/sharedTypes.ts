import { insertExpensesSchema, selectExpensesSchema } from './db/schema/expenses';
import type { Expense } from './db/schema/expenses'; // 型のみでインポートしないといけない
import { z } from 'zod';

// フォーム送信用スキーマ（既存）
export const createExpenseSchema = insertExpensesSchema.omit({
  userId: true,
  createdAt: true,
});

// 型エクスポート（完璧な型安全）
export type CreateExpenseType = z.infer<typeof createExpenseSchema>;
export type ExpenseType = Expense; // Drizzle ORMから直接インポート

// APIレスポンス用型
export type ExpensesResponse = {
  expenses: ExpenseType[];
};

export type ExpenseResponse = {
  expense: ExpenseType;
};

export type TotalSpentResponse = {
  result: {
    total: string | null;
  };
};
