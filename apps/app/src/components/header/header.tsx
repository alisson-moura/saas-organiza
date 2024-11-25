import { Users, ListTodo } from "lucide-react";
import { Separator } from "@app/components/ui/separator";
import { ModeToggle } from "../theme/mode-toggle";
import { AccountMenu } from "./account-menu";
import { Menu } from "./menu";
import { NavLink, useParams } from "react-router-dom";

export function Header() {
  const { groupId } = useParams();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <ListTodo className="h-6 w-6" />
        <Separator orientation="vertical" className="h-6" />
        <Menu />
        {groupId && (
          <NavLink
            to={`group/${groupId}/members`}
            className="flex gap-2 items-center"
          >
            <Users className="w-4 h-4" /> Membros
          </NavLink>
        )}
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
