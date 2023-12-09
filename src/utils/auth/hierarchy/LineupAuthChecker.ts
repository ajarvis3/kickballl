import IRole from "../../../models/types/role";
import LineupData from "../../db/lineup/LineupData";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";
import IAuthChecker from "./AuthChecker";
import TeamAuthChecker from "./TeamAuthChecker";

class LineupAuthChecker extends TeamAuthChecker implements IAuthChecker {
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
      LineupData.findById(entityId).then((value) => {
         if (value?._id) {
            return super.checkAuth("team", value.teamId, roles);
         }
         return undefined;
      });
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
      LineupData.findById(entityId).then((value) => {
         if (value?._id) {
            return super.checkAuthWrite("team", value.teamId, roles);
         }
         return undefined;
      });
   }
}

export default LineupAuthChecker;
