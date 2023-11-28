import mongoose from "mongoose";
import IRole from "./types/role";

const RoleSchema = new mongoose.Schema<IRole>({
   type: { type: String, required: true },
   id: { type: String, required: true },
   read: { type: Boolean, default: true },
   write: { type: Boolean, default: false },
});

export default RoleSchema;
