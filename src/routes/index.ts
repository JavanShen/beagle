import { createBrowserRouter } from "react-router";
import Layout from "@/layout";
import Playlist from "@/pages/Playlist";
import Login from "@/pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Playlist,
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);

export default router;
