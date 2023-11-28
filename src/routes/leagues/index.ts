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
import LeagueAuthChecker from "../../utils/auth/hierarchy/LeagueAuthChecker";
import getToken from "../../utils/auth/getToken";

const router = express.Router();

const authChecker = new LeagueAuthChecker();

const failed = (res: any) => {
   const err = new MyError(400, "Bad Request");
   res.status(400).send(JSON.stringify(err));
};

// check for header
router.use("/", (req, res, next) => {
   if (!req.headers.authentication) {
      res.status(401).send();
   } else {
      next();
   }
});

// check token valid
router.use("/", (req, res, next) => {
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string) as string
   ) as any;

   UserData.findUserById(decoded.sub).then((user: IUser | null) => {
      user
         ?.verifyUser(getToken(req.headers.authentication as string) as string)
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
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string) as string
   ) as any;
   const id = req.params.id ? req.params.id : "";

   UserData.findUserById(decoded.sub).then((user: IUser | null) => {
      if (user?._id) {
         const role: IRole | undefined = authChecker.checkAuth(id, user.roles);
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
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string) as string
   ) as any;
   UserData.findUserById(decoded.sub).then((user: IUser | null) => {
      if (user?._id) {
         const role: IRole | undefined = authChecker.checkAuthWrite(
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
   if (!req.headers.authentication) {
      failed(res);
   } else {
      // find one
   }
});

const leaguesRouter = router;
export default leaguesRouter;
