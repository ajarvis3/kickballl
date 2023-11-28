import IUser from "../../../models/types/user";
import User from "../../../models/user";
import IUserToken from "../../auth/types/OAuthData";

class UserData {
   createUser = (email: string, name: string, id: string) => {
      console.log("createUser");
      const _id = id;

      return new User({
         _id,
         name,
         email,
      });
   };

   saveUser = (user: IUser) => {
      console.log("saveUser", user);
      return user.save();
   };

   createAndSaveUser = (
      email: string,
      name: string,
      id: string
   ): Promise<IUser> => {
      return this.saveUser(this.createUser(email, name, id));
   };

   findOrCreateUser = (decodedToken: IUserToken) => {
      const email = decodedToken.email;
      const name = decodedToken.name;
      const id = decodedToken.sub;
      console.log(decodedToken);
      return this.findUserByEmail(email).then((user: IUser | null) => {
         if (user?._id) {
            return user;
         } else {
            return this.createAndSaveUser(email, name, id).then(
               (user: IUser | null) => {
                  if (user?._id) return user;
                  else return undefined;
               }
            );
         }
      });
   };

   findUserByEmail = (email: string) => {
      return User.findOne({ email }).exec();
   };

   findUserByUuid = (id: string) => {
      return User.findOne({ _id: id }).exec();
   };

   findUserById = (id: string) => {
      return User.findById(id).exec();
   };
}

export default new UserData();
