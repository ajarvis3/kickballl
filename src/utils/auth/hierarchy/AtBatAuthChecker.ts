import IRole from "../../../models/types/role";
import AtBatData from "../../db/atbats/AtBatData";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";
import IAuthChecker from "./AuthChecker";
import GameAuthChecker from "./GameAuthChecker";

class AtBatAuthChecker extends GameAuthChecker implements IAuthChecker {
   async checkAuth(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      if (entityType !== "atbat")
         return super.checkAuth(entityType, entityId, roles);
      const role: IRole | undefined = checkRoles("atBats", entityId, roles);
      if (role !== undefined) return role;
      AtBatData.findById(entityId).then((value) => {
         if (value?._id) {
            return super.checkAuth("game", value.gameId, roles);
         }
         return undefined;
      });
   }

   async checkAuthWrite(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      if (entityType !== "atbat")
         return super.checkAuthWrite(entityType, entityId, roles);
      const role = checkRolesWrite("atBats", entityId, roles);
      if (role !== undefined) return role;
      AtBatData.findById(entityId).then(async (value) => {
         if (value?._id) {
            return super.checkAuthWrite("game", value.gameId, roles);
         }
         return undefined;
      });
   }
}

export default AtBatAuthChecker;
