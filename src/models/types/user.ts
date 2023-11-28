import { LoginTicket } from "google-auth-library";
import mongoose from "mongoose";
import IRole from "./role";

interface IUser extends mongoose.Document {
   _id: string;
   name: string;
   email: string;
   roles: IRole[];
   verifyUser: (token: string) => Promise<LoginTicket>;
   __v: number;
}

export default IUser;
