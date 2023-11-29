import mongoose from "mongoose";
import RoleSchema from "./role";
import IRoleRequest from "./types/roleRequest";

const RoleRequestSchema = new mongoose.Schema<IRoleRequest>(
   {
      _id: {
         type: String,
         required: true,
      },
      requesterId: {
         type: String,
         required: true,
      },
      ownerId: {
         type: String,
         required: true,
      },
      role: {
         type: RoleSchema,
         required: true,
      },
   },
   { _id: false }
);

const RoleRequest: mongoose.Model<IRoleRequest> = mongoose.model(
   "RoleRequest",
   RoleRequestSchema
);
export default RoleRequest;
