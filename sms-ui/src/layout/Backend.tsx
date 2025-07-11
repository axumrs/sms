import getAuthStorage from "../getAuthStorage";
import Header from "./Header";
import { Navigate } from "react-router-dom";

export default function BackendLayout() {
  const [$auth] = getAuthStorage();
  return (
    <>
      {!$auth ? <Navigate to="/admin-login" replace /> : <Header isBackend />}
    </>
  );
}
