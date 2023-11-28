import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose";
import RoleSchema from "./role";
import IUser from "./types/user";

const UserSchema = new mongoose.Schema<IUser>(
   {
      _id: {
         type: String,
         required: true,
      },
      name: {
         type: String,
      },
      email: {
         type: String,
         required: true,
      },
      roles: {
         type: [RoleSchema],
         required: true,
      },
   },
   { _id: false }
);

UserSchema.methods.verifyUser = (credentials: string) => {
   const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
   const client = new OAuth2Client(CLIENT_ID);
   return client.verifyIdToken({
      idToken: credentials,
      audience: CLIENT_ID,
   });
};

const User: mongoose.Model<IUser> = mongoose.model("User", UserSchema);
export default User;
