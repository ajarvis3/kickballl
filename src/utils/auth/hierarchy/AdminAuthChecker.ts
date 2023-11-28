import IRole from "../../../models/types/role";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";

class AdminAuthChecker {
   checkAuth(entityId: string, roles: IRole[]): IRole | undefined {
      console.log(roles);
      return checkRoles("*", "*", roles);
   }

   checkAuthWrite(entityId: string, roles: IRole[]): IRole | undefined {
      console.log(roles);
      return checkRolesWrite("*", "*", roles);
   }
}

export default AdminAuthChecker;
