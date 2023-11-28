import IRole from "../../../models/types/role";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";
import AdminAuthChecker from "./AdminAuthChecker";

class LeagueAuthChecker extends AdminAuthChecker {
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
