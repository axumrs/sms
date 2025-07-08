import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home.tsx";
import FrontendLayout from "./layout/Frontend.tsx";
import BackendLayout from "./layout/Backend.tsx";
import AdminHomePage from "./pages/admin/Home.tsx";
import AdminDetailPage from "./pages/admin/Detail.tsx";
import StateContextProvider from "./contexts/StateContext.tsx";
import DetailPage from "./pages/Detail.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StateContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<FrontendLayout />}>
            <Route index element={<HomePage />} />
            <Route path="v/:id" element={<DetailPage />} />
          </Route>
          <Route path="/a" element={<BackendLayout />}>
            <Route index element={<AdminHomePage />} />
            <Route path="v/:id" element={<AdminDetailPage />} />
          </Route>
        </Routes>
      </Router>
    </StateContextProvider>
  </StrictMode>
);
