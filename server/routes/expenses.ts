import { Hono } from 'hono'; // Webフレームワーク
import { zValidator } from '@hono/zod-validator'; // バリデーター
import { z } from 'zod'; // スキーマ検証ライブラリ

const expenseSchema = z.object({
  id: z.number().int().positive().min(1), // 支出ID
  title: z.string().min(3).max(100), // 支出タイトル
  amount: z.number().int().positive(), //　金額
});

// ZodスキーマからTypeScriptの型を生成
type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

// テストデータ
const fakeExpenses: Expense[] = [
  { id: 1, title: 'Groceries', amount: 50 }, // 食料品
  { id: 2, title: 'Utilities', amount: 100 }, // 光熱費
  { id: 3, title: 'Rest', amount: 1000 }, // その他
];

export const expensesRoute = new Hono()
  // GET：支出一覧取得　全ての支出データを JSON で返す
  .get('/', c => {
    return c.json({ expenses: fakeExpenses });
  })
  // POST：新しい支出作成
  .post('/', zValidator('json', createPostSchema), async c => {
    const data = await c.req.json();
    const expense = createPostSchema.parse(data);
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    c.status(201);
    return c.json(expense);
  })

  .get('/total-spent', async c => {
    const total = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    return c.json({ total });
  })

  .get('/:id{[0-9]+}', c => {
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
