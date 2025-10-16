import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createFileRoute } from '@tanstack/react-router';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
});

async function getAllExpenses() {
  await new Promise(r => setTimeout(r, 3000));
  const res = await api.expenses.$get();
  if (!res.ok) {
    throw new Error('server error');
  }
  const data = await res.json();
  return data;
}

function Expenses() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-expenses'],
    queryFn: getAllExpenses,
  });

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="m-auto max-w-3xl p-2">
      <Table>
        <TableCaption>A list of all your expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? // スケルトンローディング表示
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                  </TableRow>
                ))
            : // 実際のデータ表示
              data?.expenses?.map(expense => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>${expense.amount}</TableCell>
                  <TableCell>{expense.date.split('T')[0]}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
