import { useLocalStorage } from "react-use";

export default function getAuthStorage() {
  return useLocalStorage<AdminAuth>("auth");
}
