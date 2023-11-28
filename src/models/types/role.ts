import mongoose from "mongoose";

interface IRole extends mongoose.Document {
   type: string; // e.g. league
   id: string; // id of entity (e.g. league entity)
   read: boolean;
   write: boolean;
}

export default IRole;
