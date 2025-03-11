import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="h-screen w-screen flex flex-row">
      <menu className="w-2/12 min-w-56 h-full bg-blue-200">this is a menu</menu>
      <main className="h-full flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
