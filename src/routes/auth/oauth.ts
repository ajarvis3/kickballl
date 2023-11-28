import * as express from "express";
import MyError from "../../types/Error";
import IUserToken from "../../utils/auth/types/OAuthData";
import jwt from "jsonwebtoken";
import IUser from "../../models/types/user";
import UserData from "../../utils/db/users/UserData";

const router = express.Router();

/* POST signin data */
router.post("/", (req, res, next) => {
   console.log("/auth");
   const failed = () => {
      const err = new MyError(401, "Unauthorized");
      next(err);
   };

   console.log("!req.body.credential || !req.body.clientId");
   if (!req.body.credential || !req.body.clientId) {
      failed();
   }
   const decoded: IUserToken = jwt.decode(req.body.credential) as IUserToken;

   console.log("UserData.findOrCreateUser", decoded);
   UserData.findOrCreateUser(decoded).then((user: IUser | undefined) => {
      console.log("if(user)", user);
      if (user) {
         user
            .verifyUser(req.body.credential)
            .then((_) => {
               res.status(200).send({
                  auth: true,
                  id: user._id,
                  token: req.body.credential,
               });
            })
            .catch((e) => {
               failed();
            });
      } else {
         failed();
      }
   });
});

const userRouter = router;
export default userRouter;
