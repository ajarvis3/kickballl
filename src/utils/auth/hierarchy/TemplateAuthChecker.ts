import IRole from "../../../models/types/role";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";
import LeagueAuthChecker from "./LeagueAuthChecker";

class TemplateAuthChecker extends LeagueAuthChecker {
   checkAuth(entityId: string, roles: IRole[]): IRole | undefined {
      const role: IRole | undefined = checkRoles("templates", entityId, roles);
      if (role !== undefined) return role;
      return super.checkAuth(entityId, roles);
   }

   checkAuthWrite(entityId: string, roles: IRole[]): IRole | undefined {
      const role = checkRolesWrite("templates", entityId, roles);
      if (role !== undefined) return role;
      return super.checkAuthWrite(entityId, roles);
   }
}

export default TemplateAuthChecker;
