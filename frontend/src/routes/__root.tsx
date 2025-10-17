import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { type QueryClient } from '@tanstack/react-query';

interface MyRouterContext {
  queryClient: QueryClient;
}

createRootRouteWithContext;
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function NavBar() {
  return (
    <div className="m-auto flex max-w-2xl items-center justify-between p-2">
      <Link to="/">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
      </Link>
      <div className="flex gap-2">
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/create-expense" className="[&.active]:font-bold">
          Create
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
      </div>
    </div>
  );
}

function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <div className="m-auto flex max-w-2xl gap-2 p-2">
        <Outlet />
      </div>
    </>
  );
}
