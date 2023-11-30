import IRole from "../../../models/types/role";
import LineupData from "../../db/lineup/LineupData";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";
import IAuthChecker from "./AuthChecker";
import GameAuthChecker from "./GameAuthChecker";

class LineupAuthChecker extends GameAuthChecker implements IAuthChecker {
   async checkAuth(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      if (entityType !== "lineup")
         return await super.checkAuth(entityType, entityId, roles);
      const role: IRole | undefined = checkRoles("lineups", entityId, roles);
      if (role !== undefined) return role;
      // will not go anywhere
      // LineupData.findById(entityId).then((value) => {
      //    if (value?._id) {
      //       return super.checkAuth("game", value._id, roles);
      //    }
      //    return undefined;
      // });
   }

   async checkAuthWrite(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      if (entityType !== "lineup")
         return await super.checkAuthWrite(entityType, entityId, roles);
      const role = checkRolesWrite("lineups", entityId, roles);
      if (role !== undefined) return role;
      // will not go anywhere
      // LineupData.findById(entityId).then((value) => {
      //    if (value?._id) {
      //       return super.checkAuthWrite("game", value., roles);
      //    }
      //    return undefined;
      // });
   }
}

export default LineupAuthChecker;
