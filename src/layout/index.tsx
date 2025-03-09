import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="h-screen w-screen">
      <menu>this is a menu</menu>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
