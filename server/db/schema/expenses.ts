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
import z from 'zod';

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

export const insertExpensesSchema = createInsertSchema(expenses, {
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100, { message: 'Title must be at most 100 characters' }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a valid monetary value' }),
});
export const selectExpensesSchema = createInsertSchema(expenses);
