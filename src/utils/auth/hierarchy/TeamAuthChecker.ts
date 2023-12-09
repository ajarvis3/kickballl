import IRole from "../../../models/types/role";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";
import LeagueAuthChecker from "./LeagueAuthChecker";
import IAuthChecker from "./AuthChecker";

class TeamAuthChecker extends LeagueAuthChecker implements IAuthChecker {
   async checkAuth(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      if (entityType !== "team")
         return super.checkAuth(entityType, entityId, roles);
      const role: IRole | undefined = checkRoles("teams", entityId, roles);
      if (role !== undefined) return role;
      return super.checkAuth(entityType, entityId, roles);
   }

   async checkAuthWrite(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      if (entityType !== "team")
         return super.checkAuthWrite(entityType, entityId, roles);
      const role = checkRolesWrite("teams", entityId, roles);
      if (role !== undefined) return role;
      return super.checkAuthWrite(entityType, entityId, roles);
   }
}

export default TeamAuthChecker;
