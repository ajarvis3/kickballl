import IRole from "../../../models/types/role";
import GameData from "../../db/games/GameData";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";
import IAuthChecker from "./AuthChecker";
import TemplateAuthChecker from "./TemplateAuthChecker";

class GameAuthChecker extends TemplateAuthChecker implements IAuthChecker {
   async checkAuth(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      if (entityType !== "game")
         return super.checkAuth(entityType, entityId, roles);
      const role: IRole | undefined = checkRoles("games", entityId, roles);
      if (role !== undefined) return role;
      return GameData.findById(entityId).then(async (value) => {
         if (value?._id) {
            return super.checkAuth("template", value.ruleTemplateId, roles);
         }
         return undefined;
      });
   }

   async checkAuthWrite(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      if (entityType !== "game")
         return super.checkAuthWrite(entityType, entityId, roles);
      const role = checkRolesWrite("games", entityId, roles);
      if (role !== undefined) return role;
      GameData.findById(entityId).then(async (value) => {
         if (value?._id) {
            return super.checkAuthWrite(
               "template",
               value.ruleTemplateId,
               roles
            );
         }
         return undefined;
      });
   }
}

export default GameAuthChecker;
