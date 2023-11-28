import IRole from "../../../models/types/role";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";
import GameAuthChecker from "./GameAuthChecker";

class LineupAuthChecker extends GameAuthChecker {
   checkAuth(entityId: string, roles: IRole[]): IRole | undefined {
      const role: IRole | undefined = checkRoles("lineups", entityId, roles);
      if (role !== undefined) return role;
      return super.checkAuth(entityId, roles);
   }

   checkAuthWrite(entityId: string, roles: IRole[]): IRole | undefined {
      const role = checkRolesWrite("lineups", entityId, roles);
      if (role !== undefined) return role;
      return super.checkAuthWrite(entityId, roles);
   }
}

export default LineupAuthChecker;
