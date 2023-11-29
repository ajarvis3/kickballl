import IRole from "../../../models/types/role";
import { v4 as uuidv4 } from "uuid";
import RoleRequest from "../../../models/roleRequest";
import IRoleRequest from "../../../models/types/roleRequest";

class RoleRequestData {
   createRoleRequest = (requesterId: string, ownerId: string, role: IRole) => {
      const _id = uuidv4();
      return new RoleRequest({
         requesterId,
         ownerId,
         role,
      });
   };
   saveRoleRequest = (role: IRoleRequest) => {
      return role.save();
   };
   createAndSaveRole = (requesterId: string, ownerId: string, role: IRole) => {
      return this.saveRoleRequest(
         this.createRoleRequest(requesterId, ownerId, role)
      );
   };
   findByRequesterId = (requesterId: string) => {
      return RoleRequest.find({ requesterId }).exec();
   };
   findByOwnerId = (ownerId: string) => {
      return RoleRequest.find({ ownerId }).exec();
   };
   findById = (id: string) => {
      return RoleRequest.findById(id).exec();
   };
   updateById = (id: string, role: IRole) => {
      return RoleRequest.findByIdAndUpdate(id, { role }).exec();
   };
   deleteById = (id: string) => {
      return RoleRequest.findByIdAndDelete(id).exec();
   };
}

export default new RoleRequestData();
