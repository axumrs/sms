import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home.tsx";
import FrontendLayout from "./layout/Frontend.tsx";
import BackendLayout from "./layout/Backend.tsx";
import AdminHomePage from "./pages/admin/Home.tsx";
import AdminDetailPage from "./pages/admin/Detail.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<FrontendLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/a" element={<BackendLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="d/:id" element={<AdminDetailPage />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
