import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/react";
import { RouterProvider } from "react-router";
import Router from "@/routes";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <RouterProvider router={Router} />
    </HeroUIProvider>
  </StrictMode>,
);
