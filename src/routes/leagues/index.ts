import express from "express";
import MyError from "../../types/Error";
import UserData from "../../utils/db/users/UserData";
import jwt from "jsonwebtoken";
import IUser from "../../models/types/user";
import IRole from "../../models/types/role";
import LeaguesData from "../../utils/db/leagues/LeaguesData";
import ILeague from "../../models/types/league";
import LeagueAuthChecker from "../../utils/auth/hierarchy/LeagueAuthChecker";
import getToken from "../../utils/auth/getToken";
import IAuthChecker from "../../utils/auth/hierarchy/AuthChecker";

const router = express.Router();

const authChecker: IAuthChecker = new LeagueAuthChecker();

const failed = (res: any) => {
   const err = new MyError(400, "Bad Request");
   res.status(400).send(JSON.stringify(err));
};

// check for header
router.use("/", (req, res, next) => {
   authChecker.checkTokenExists(req, res, next);
});

// check token valid
router.use("/", (req, res, next) => {
   authChecker.checkTokenValid(req, res, next);
});

// check for permissions
router.use("/:id", (req, res, next) => {
   authChecker.checkTokenPermissions("league", req, res, next);
});

router.get("/:id", (req, res, _) => {
   if (!req.params.id) {
      failed(res);
   } else {
      LeaguesData.findById(req.params.id).then((value) => {
         res.status(200).send(JSON.stringify(value));
      });
   }
});

router.post("/", (req, res, _) => {
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string) as string
   ) as any;
   UserData.findUserById(decoded.sub).then(async (user: IUser | null) => {
      if (user?._id) {
         const role: IRole | undefined = await authChecker.checkAuthWrite(
            "league",
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
