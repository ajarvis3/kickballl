import IRole from "../../../models/types/role";
import TemplateData from "../../db/templates/TemplateData";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";
import IAuthChecker from "./AuthChecker";
import LeagueAuthChecker from "./LeagueAuthChecker";

class TemplateAuthChecker extends LeagueAuthChecker implements IAuthChecker {
   async checkAuth(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      if (entityType !== "template")
         return super.checkAuth(entityType, entityId, roles);
      const role: IRole | undefined = checkRoles("templates", entityId, roles);
      if (role !== undefined) return role;
      return TemplateData.findById(entityId).then(async (value) => {
         if (value?._id) {
            return super.checkAuth("league", value.league, roles);
         }
         return undefined;
      });
   }

   async checkAuthWrite(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      if (entityType !== "template")
         return super.checkAuthWrite(entityType, entityId, roles);
      const role = checkRolesWrite("templates", entityId, roles);
      if (role !== undefined) return role;
      TemplateData.findById(entityId).then(async (value) => {
         if (value?._id) {
            return super.checkAuthWrite("league", value.league, roles);
         }
         return undefined;
      });
   }
}

export default TemplateAuthChecker;
