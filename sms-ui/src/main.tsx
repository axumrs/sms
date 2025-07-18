import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home.tsx";
import FrontendLayout from "./layout/Frontend.tsx";
import BackendLayout from "./layout/Backend.tsx";
import AdminHomePage from "./pages/admin/Home.tsx";
import AdminDetailPage from "./pages/admin/Detail.tsx";
import StateContextProvider from "./contexts/StateContext.tsx";
import DetailPage from "./pages/Detail.tsx";
import AdminLoginPage from "./pages/AdminLogin.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StateContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<FrontendLayout />}>
            <Route index element={<HomePage />} />
            <Route path="v/:id" element={<DetailPage />} />
            <Route path="u/:email">
              <Route path="" element={<HomePage />} />
              <Route path="o/:orderId" element={<HomePage />} />
              <Route path="m/:action" element={<HomePage />} />
            </Route>
          </Route>
          <Route path="/a" element={<BackendLayout />}>
            <Route index element={<AdminHomePage />} />
            <Route path="v/:id" element={<AdminDetailPage />} />
          </Route>
        </Routes>
        <Routes>
          <Route path="/admin-login" element={<AdminLoginPage />} />
        </Routes>
      </Router>
    </StateContextProvider>
  </StrictMode>
);
