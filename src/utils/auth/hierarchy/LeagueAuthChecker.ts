import IRole from "../../../models/types/role";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";
import AdminAuthChecker from "./AdminAuthChecker";
import IAuthChecker from "./AuthChecker";

class LeagueAuthChecker extends AdminAuthChecker implements IAuthChecker {
   checkAuth(entityId: string, roles: IRole[]): IRole | undefined {
      const role: IRole | undefined = checkRoles("leagues", entityId, roles);
      if (role !== undefined) return role;
      return super.checkAuth(entityId, roles);
   }

   checkAuthWrite(entityId: string, roles: IRole[]): IRole | undefined {
      const role = checkRolesWrite("leagues", entityId, roles);
      if (role !== undefined) return role;
      return super.checkAuthWrite(entityId, roles);
   }
}

export default LeagueAuthChecker;
