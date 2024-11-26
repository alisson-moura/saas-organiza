import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";
import { Resource, Action, Condition, Role } from "./types";

// Tipo da Ability que será exportada
export type AppAbility = MongoAbility<[Action, Resource], Condition>;

// Função para definir abilities baseado em um perfil de usuário
export function defineAbilitiesFor(role: Role, groupId: number) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  switch (role) {
    case "Lider":
      can("manage", "Invite", { groupId });
      can("manage", "Member", { groupId });
      break;
    case "Organizador":
      can("manage", "Invite", { groupId });
      can("read", "Member", { groupId });
      can("update", "Member", { groupId });
      break;
    case "Participante":
      can("read", "Member", { groupId });
      can("read", "Invite", { groupId });
      break;
    case "Observador":
      can("read", "Member", { groupId });
      can("read", "Invite", { groupId });
      break;

    default:
      cannot("manage", "all");
  }
  return build();
}

export function checkAbility(
  ability: AppAbility,
  action: Action,
  resource: Resource
) {
  return ability.can(action, resource);
}
