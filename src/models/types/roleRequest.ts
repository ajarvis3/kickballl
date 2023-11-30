import mongoose from "mongoose";
import IRole from "./role";

interface IRoleRequest extends mongoose.Document {
   _id: string;
   requesterId: string;
   ownerId: string;
   role: IRole;
   __v: number;
}

export default IRoleRequest;
