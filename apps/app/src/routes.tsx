import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "./pages/app/dashboard";
import { SignInPage } from "./pages/auth/sign-in";
import { SignUpPage } from "./pages/auth/sign-up";
import { AppLayout } from "./pages/app/layout";
import { AuthLayout } from "./pages/auth/layout";
import { GroupPage } from "./pages/app/group";
import { MembersPage } from "./pages/app/members/page";
import { ListPage } from "./pages/app/lists/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      {path: '/group/:groupId', element: <GroupPage />},
      {path: '/group/:groupId/members', element: <MembersPage />},
      {path: '/group/:groupId/lists/:listId', element: <ListPage />}
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
    ],
  },
]);
