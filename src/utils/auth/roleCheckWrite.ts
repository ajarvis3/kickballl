import IRole from "../../models/types/role";

const checkRolesWrite = (
   entityType: string,
   entityId: string,
   roles: IRole[]
) => {
   return roles.find((value: IRole) => {
      const type = value.type;
      const id = value.id;
      const correctType = type === entityType || type === "*";
      const correctId = id === entityId || id === "*";
      return correctType && correctId && value.write;
   });
};

export default checkRolesWrite;
