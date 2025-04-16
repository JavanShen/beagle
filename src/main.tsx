import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/react";
import { RouterProvider } from "react-router";
import Router from "@/routes";
import { configResponsive } from "ahooks";
import "./index.css";

configResponsive({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <RouterProvider router={Router} />
    </HeroUIProvider>
  </StrictMode>,
);
