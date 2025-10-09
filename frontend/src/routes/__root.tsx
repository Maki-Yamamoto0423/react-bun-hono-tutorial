import { Link, Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: Root,
});

function NavBar() {
  return (
    <div className="flex gap-2 p-2 text-lg">
      <Link to="/" className="hover:underline [&.active]:font-bold">
        Home
      </Link>
      <Link to="/about" className="hover:underline [&.active]:font-bold">
        About
      </Link>
      <Link to="/expenses" className="hover:underline [&.active]:font-bold">
        Expenses
      </Link>
      <Link to="/create-expense" className="hover:underline [&.active]:font-bold">
        Create Expense
      </Link>
    </div>
  );
}

function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <Outlet />
    </>
  );
}
