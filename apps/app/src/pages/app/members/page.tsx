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
  return (
    <Tabs defaultValue="members" className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center gap-8">
        <TabsList>
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="invites">Convites</TabsTrigger>
        </TabsList>
        <InviteForm />
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
