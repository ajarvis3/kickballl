import express from "express";
import MyError from "../../types/Error";
import IUserToken from "../../utils/auth/types/OAuthData";
import UserData from "../../utils/db/users/UserData";
import jwt from "jsonwebtoken";
import IUser from "../../models/types/user";
import checkRoles from "../../utils/auth/roleCheck";
import IRole from "../../models/types/role";
import checkRolesWrite from "../../utils/auth/roleCheckWrite";
import LeaguesData from "../../utils/db/leagues/LeaguesData";
import ILeague from "../../models/types/league";

const router = express.Router();

const failed = (res: any) => {
   const err = new MyError(400, "Bad Request");
   res.status(400).send(JSON.stringify(err));
};

// check for header
router.use("/", (req, res, next) => {
   if (!req.headers.authorization) {
      res.status(401).send();
   } else {
      next();
   }
});

// check token valid
router.use("/", (req, res, next) => {
   const decoded: IUserToken = jwt.decode(
      req.headers.authorization!
   ) as IUserToken;

   UserData.findUserById(decoded.sub).then((user: IUser | null) => {
      user
         ?.verifyUser(req.headers.authorization!)
         .then((_) => {
            next();
         })
         .catch((e) => {
            res.status(401).send();
         });
   });
});

// check for permissions
router.use("/:id?", (req, res, next) => {
   const decoded: IUserToken = jwt.decode(
      req.headers.authorization!
   ) as IUserToken;
   const id = req.params.id ? req.params.id : "";

   UserData.findUserById(decoded.sub).then((user: IUser | null) => {
      if (user?._id) {
         const role: IRole | undefined = checkRoles("leagues", id, user.roles);
         if (typeof role === "undefined") {
            res.status(403).send();
         } else {
            next();
         }
      } else {
         res.status(401).send();
      }
   });
});

router.get("/:id", (req, res, _) => {
   if (!req.params.id) {
      failed(res);
   } else {
      // find it
      res.status(200).send(JSON.stringify({}));
   }
});

router.post("/", (req, res, _) => {
   const decoded: IUserToken = jwt.decode(
      req.headers.authorization!
   ) as IUserToken;
   UserData.findUserById(decoded.sub).then((user: IUser | null) => {
      if (user?._id) {
         const role: IRole | undefined = checkRolesWrite(
            "leagues",
            "",
            user.roles
         );
         if (typeof role === "undefined") {
            res.status(403).send();
         } else {
            LeaguesData.createAndSaveLeague(req.body.leagueName, user._id).then(
               (league: ILeague) => {
                  if (league._id) {
                     res.status(200).send(JSON.stringify(league));
                  } else {
                     res.status(400).send();
                  }
               }
            );
         }
      } else {
         res.status(401).send();
      }
   });

   // create new
   if (!req.headers.authorization) {
      failed(res);
   } else {
      // find one
   }
});

const leaguesRouter = router;
export default leaguesRouter;
