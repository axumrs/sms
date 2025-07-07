import { useParams } from "react-router-dom";

export default function AdminDetailPage() {
  const { id } = useParams();
  return <div>AdminDetailPage - {id}</div>;
}
