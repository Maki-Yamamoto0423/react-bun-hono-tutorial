import { Hono } from 'hono'; // Webフレームワーク
import { zValidator } from '@hono/zod-validator'; // バリデーター
import { z } from 'zod'; // スキーマ検証ライブラリ
import { getUser } from '../kinde';
import { db } from '../db';
import { expenses as expensesTable } from '../db/schema/expenses';
import { eq } from 'drizzle-orm';

const expenseSchema = z.object({
  id: z.number().int().positive().min(1), // 支出ID
  title: z.string().min(3).max(100), // 支出タイトル
  amount: z.string(), //　金額
});

// ZodスキーマからTypeScriptの型を生成
type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

// テストデータ
const fakeExpenses: Expense[] = [
  { id: 1, title: 'Groceries', amount: '50' }, // 食料品
  { id: 2, title: 'Utilities', amount: '100' }, // 光熱費
  { id: 3, title: 'Rest', amount: '1000' }, // その他
];

export const expensesRoute = new Hono()
  // GET：支出一覧取得　全ての支出データを JSON で返す
  .get('/', getUser, async c => {
    const user = c.var.user;

    const expenses = await db.select().from(expensesTable).where(eq(expensesTable.userId, user.id));
    return c.json({ expenses: expenses });
  })
  // POST：新しい支出作成
  .post('/', getUser, zValidator('json', createPostSchema), async c => {
    const expense = await c.req.valid('json');
    const user = c.var.user;

    const result = await db
      .insert(expensesTable)
      .values({
        ...expense,
        userId: user.id,
      })
      .returning();

    c.status(201);
    return c.json(result);
  })

  .get('/total-spent', getUser, async c => {
    const total = fakeExpenses.reduce((acc, expense) => acc + +expense.amount, 0);
    return c.json({ total });
  })

  .get('/:id{[0-9]+}', getUser, c => {
    const id = Number.parseInt(c.req.param('id'));
    const expense = fakeExpenses.find(expense => expense.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })

  .delete('/:id{[0-9]+}', c => {
    const id = Number.parseInt(c.req.param('id'));
    const index = fakeExpenses.findIndex(expense => expense.id === id);
    if (index === -1) {
      return c.notFound();
    }

    const deletedExpense = fakeExpenses.splice(index, 1)[0];
    return c.json({ expense: deletedExpense });
  });
