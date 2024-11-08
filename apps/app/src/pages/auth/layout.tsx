import { Outlet } from "react-router-dom";
import { ListTodo } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-2 antialiased">
      <div className="h-full border-r border-foreground/2 bg-muted p-10 text-muted-foreground flex flex-col justify-between">
        <div className="flex items-center gap-3 text-lg text-foreground">
          <ListTodo size={28} />
          <span className="font-semibold">organiza.app</span>
        </div>
        <footer className="text-sm">
          &copy; organiza.app - {new Date().getFullYear()}
        </footer>
      </div>
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-[350px] flex flex-col justify-center gap-6 relative">
          <div className="flex flex-col items-center justify-center">
            <ListTodo size={64} />
            <h1 className="text-2xl  tracking-tight font-semibold">Organiza</h1>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
