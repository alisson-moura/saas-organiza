import { z } from "zod";

// Define as roles
export const RoleSchema = z.enum([
  "Lider",
  "Organizador",
  "Participante",
  "Observador",
]);
export type Role = z.infer<typeof RoleSchema>;

// Define os possíveis recursos do sistema
export const ResourceSchema = z.enum(["Member", "Invite", "List", "all"]);
export type Resource = z.infer<typeof ResourceSchema>;

// Define as possíveis ações
export const ActionSchema = z.enum([
  "create",
  "read",
  "update",
  "delete",
  "manage",
  "all",
]);
export type Action = z.infer<typeof ActionSchema>;

// Define condições adicionais para as permissões
export const ConditionSchema = z.object({
  groupId: z.number(),
});
export type Condition = z.infer<typeof ConditionSchema>;
