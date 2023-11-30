import IRole from "../../../models/types/role";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";
import AdminAuthChecker from "./AdminAuthChecker";
import IAuthChecker from "./AuthChecker";

class LeagueAuthChecker extends AdminAuthChecker implements IAuthChecker {
   async checkAuth(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      if (entityType !== "league")
         return super.checkAuth(entityType, entityId, roles);
      const role: IRole | undefined = checkRoles("league", entityId, roles);
      if (role !== undefined) return role;
      return super.checkAuth(entityType, entityId, roles);
   }

   async checkAuthWrite(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      if (entityType !== "league")
         return super.checkAuthWrite(entityType, entityId, roles);
      const role = checkRolesWrite("leagues", entityId, roles);
      if (role !== undefined) return role;
      return super.checkAuthWrite(entityType, entityId, roles);
   }
}

export default LeagueAuthChecker;
