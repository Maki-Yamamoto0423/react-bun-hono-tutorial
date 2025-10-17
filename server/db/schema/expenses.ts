import {
  index,
  numeric,
  text,
  integer,
  pgEnum,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import type {
  ExpensesResponse,
  ExpenseResponse,
  TotalSpentResponse,
  ExpenseType,
} from '../../sharedTypes';

export const expenses = pgTable(
  'expenses',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    date: date('date').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  expenses => {
    return {
      userIdIndex: index('name_idx').on(expenses.userId),
    };
  }
);

// INSERT用スキーマ（バリデーション付き）
export const insertExpensesSchema = createInsertSchema(expenses, {
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100, { message: 'Title must be at most 100 characters' }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a valid monetary value' }),
});

// SELECT用スキーマ
export const selectExpensesSchema = createSelectSchema(expenses);

// TypeScript型を自動生成・エクスポート
export type Expense = typeof expenses.$inferSelect; // SELECT用型
export type NewExpense = typeof expenses.$inferInsert; // INSERT用型

// Zodスキーマから推論される型もエクスポート
export type InsertExpenseType = z.infer<typeof insertExpensesSchema>;
export type SelectExpenseType = z.infer<typeof selectExpensesSchema>;
