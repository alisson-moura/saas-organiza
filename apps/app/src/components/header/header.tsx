import { Home, ListCheck, ListTodo, Users } from "lucide-react";
import { Separator } from "@app/components/ui/separator";
import { NavLink } from "./nav-link";
import { ModeToggle } from "../theme/mode-toggle";
import { AccountMenu } from "./account-menu";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <ListTodo className="h-6 w-6" />
        <Separator orientation="vertical" className="h-6" />
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="w-4 h-4" /> Início
          </NavLink>
          <NavLink to="/groups">
            <Users className="w-4 h-4" /> Grupos
          </NavLink>
          <NavLink to="/lists">
            <ListCheck className="w-4 h-4" /> Listas
          </NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <AccountMenu  />
        </div>
      </div>
    </div>
  );
}
