import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
});

async function getTotalSpent() {
  const res = await api.expenses['total-spent'].$get();
  if (!res.ok) {
    throw new Error('server error');
  }
  const data = await res.json();
  return data;
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-total-spent'],
    queryFn: getTotalSpent,
  });

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <Card className="m-auto w-[350px]">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total amount you've spent</CardDescription>
      </CardHeader>
      <CardContent>{isPending ? 'Loading...' : `$${data?.result?.total || '0.00'}`}</CardContent>
    </Card>
  );
}
