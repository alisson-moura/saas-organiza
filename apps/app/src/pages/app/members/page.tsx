import { AbilityContext } from "@app/lib/casl";
import { Can } from "@casl/react";
import { useContext } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@app/components/ui/tabs";
import { InviteForm } from "./invite-form";
import { InviteList } from "./invites-list";
import { MembersList } from "./members";

export function MembersPage() {
  const ability = useContext(AbilityContext);
  return (
    <Tabs defaultValue="members" className="w-full max-w-screen-lg mx-auto space-y-8">
      <div className="flex justify-between items-center gap-8">
        <TabsList>
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="invites">Convites</TabsTrigger>
        </TabsList>
        <Can ability={ability} I="create" a="Invite">
          <InviteForm />
        </Can>
      </div>
      <TabsContent value="members">
        <MembersList />
      </TabsContent>
      <TabsContent value="invites">
        <InviteList />
      </TabsContent>
    </Tabs>
  );
}
