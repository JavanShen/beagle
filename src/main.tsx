import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/react";
import { RouterProvider } from "react-router";
import Router from "@/routes";
import { configResponsive } from "ahooks";
import NiceModal from "@ebay/nice-modal-react";
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
    <NiceModal.Provider>
      <HeroUIProvider>
        <main>
          <ToastProvider placement="top-right" />
          <RouterProvider router={Router} />
        </main>
      </HeroUIProvider>
    </NiceModal.Provider>
  </StrictMode>,
);
