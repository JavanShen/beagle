import { createBrowserRouter } from "react-router";
import Layout from "@/layout";
import Playlist from "@/pages/Playlist";

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
]);

export default router;
