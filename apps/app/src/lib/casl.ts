import { createContext } from "react";
import { AppAbility } from "@organiza/authorization";

export const AbilityContext = createContext<AppAbility>({} as AppAbility);
