import { createBrowserRouter } from "react-router";
import Layout from "@/layout";
import Playlist from "@/pages/Playlist";
import Settings from "@/pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        path: "/playlist/:playlistId?",
        Component: Playlist,
      },
      {
        path: "/settings",
        Component: Settings,
      },
    ],
  },
]);

export default router;
