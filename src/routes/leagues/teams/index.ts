import express from "express";
import MyError from "../../../types/Error";
import TeamsData from "../../../utils/db/leagues/teams/TeamsData";
import jwt from "jsonwebtoken";
import getToken from "../../../utils/auth/getToken";
import IUser from "../../../models/types/user";
import UserData from "../../../utils/db/users/UserData";
import IRole from "../../../models/types/role";
import TeamAuthChecker from "../../../utils/auth/hierarchy/TeamAuthChecker";
import ILeague from "../../../models/types/league";
import IAuthChecker from "../../../utils/auth/hierarchy/AuthChecker";
import ITeam from "../../../models/types/team";

const router = express.Router();

const authChecker: IAuthChecker = new TeamAuthChecker();

// /leagues/teams
const failed = (res: any) => {
   const err = new MyError(400, "Bad Request");
   res.status(400).send(JSON.stringify(err));
};

router.get("/:id", (req, res, _) => {
   if (!req.params.id) {
      failed(res);
   } else {
      TeamsData.findById(req.params.id).then((value) => {
         res.status(200).send(JSON.stringify(value));
      });
   }
});

router.post("/", (req, res, next) => {
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string)
   );
   UserData.findUserById(
      decoded.sub.then(async (user: IUser | null) => {
         if (user?._id) {
            const role: IRole | undefined = await authChecker.checkAuthWrite(
               "league",
               req.body.leagueId,
               user.roles
            );
            if (typeof role === "undefined") {
               res.status(403).send();
            } else {
               TeamsData.createAndSaveTeam(
                  req.body.teamName,
                  user._id,
                  req.body.leagueId
               ).then((team: ITeam) => {
                  if (team._id) {
                     res.status(200).send(JSON.stringify(team));
                  } else {
                     res.status(400).send();
                  }
               });
            }
         } else {
            res.status(401).send();
         }
      })
   );
});

const TeamRouter = router;
export default TeamRouter;
