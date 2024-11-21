import { ListTodo } from "lucide-react";
import { Separator } from "@app/components/ui/separator";
import { ModeToggle } from "../theme/mode-toggle";
import { AccountMenu } from "./account-menu";
import { Menu } from "./menu";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <ListTodo className="h-6 w-6" />
        <Separator orientation="vertical" className="h-6" />
        <Menu />
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
