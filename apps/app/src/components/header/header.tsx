import { Users, ListTodo, ListCheck } from "lucide-react";
import { Separator } from "@app/components/ui/separator";
import { ModeToggle } from "../theme/mode-toggle";
import { AccountMenu } from "./account-menu";
import { Menu } from "./menu";
import { useParams } from "react-router-dom";
import { NavLink } from "./nav-link";

export function Header() {
  const { groupId } = useParams();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <ListTodo className="h-6 w-6" />
        <Separator orientation="vertical" className="h-6" />
        <Menu />
        {groupId && (
          <div className="flex gap-4">
            <NavLink to={`group/${groupId}/lists`}>
              <ListCheck className="w-4 h-4" /> Listas
            </NavLink>
            <NavLink to={`group/${groupId}/members`}>
              <Users className="w-4 h-4" /> Membros
            </NavLink>
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
