import { LoginTicket } from "google-auth-library";
import mongoose from "mongoose";

interface IUser extends mongoose.Document {
    _id: string;
    name: string;
    email: string;
    verifyUser: (token: string) => Promise<LoginTicket>;
    __v: number;
}

export default IUser;
