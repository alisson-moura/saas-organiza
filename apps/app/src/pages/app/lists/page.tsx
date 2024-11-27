import { useParams } from "react-router-dom";

export function ListPage() {
  const { listId } = useParams<{ listId: string }>();
  return <h1>List With Id: {listId}</h1>;
}
