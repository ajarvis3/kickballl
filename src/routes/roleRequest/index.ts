import express from "express";
import getToken from "../../utils/auth/getToken";
import AdminAuthChecker from "../../utils/auth/hierarchy/AdminAuthChecker";
import jwt from "jsonwebtoken";
import IRole from "../../models/types/role";
import UserData from "../../utils/db/users/UserData";
import IUser from "../../models/types/user";
import RoleRequestData from "../../utils/db/rolerequests/RoleRequestData";
import IRoleRequest from "../../models/types/roleRequest";
import LeaguesData from "../../utils/db/leagues/LeaguesData";
import TemplateData from "../../utils/db/templates/TemplateData";
import GameData from "../../utils/db/games/GameData";

// /roleRequest
const router = express.Router();

const authChecker = new AdminAuthChecker();

router.use("/", (req, res, next) => {
   authChecker.checkTokenExists(req, res, next);
});

router.use("/", (req, res, next) => {
   authChecker.checkTokenValid(req, res, next);
});

router.post("/", async (req, res, next) => {
   if (!req.body.role) {
      res.status(400).send("Field Missing");
      return;
   }
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string) as string
   ) as any;
   const role = req.body.role as IRole;
   let ownerId = req.body.ownerId;
   if (!req.body.ownerId) {
      let dataRetriever = undefined;
      if (role.type === "league") dataRetriever = LeaguesData;
      if (role.type === "template") dataRetriever = TemplateData;
      if (role.type === "game") dataRetriever = GameData;
      ownerId = await dataRetriever?.findById(role.id).then((value) => {
         if (value && value.owner) {
            console.log(value.owner);
            return value.owner;
         } else {
            res.status(400).send();
         }
      });
   }
   console.log(ownerId);
   UserData.findUserById(decoded.sub).then((user: IUser | null) => {
      console.log("user", user);
      if (user?._id) {
         RoleRequestData.createAndSaveRole(user._id, ownerId, role).then(
            (value) => {
               res.status(200).send(JSON.stringify(value));
            }
         );
      } else {
         res.status(401).send();
      }
   });
});

router.put("/:id", (req, res, next) => {
   if (!req.params.id || !req.body.role) {
      res.status(400).send("Missing Fields");
      return;
   }
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string) as string
   ) as any;
   UserData.findUserById(decoded.sub).then(async (user: IUser | null) => {
      if (user?._id) {
         const writeRole: IRole | undefined = await authChecker.checkAuthWrite(
            req.body.role.type,
            req.params.id,
            user.roles
         );
         if (writeRole) {
            RoleRequestData.updateById(req.params.id, req.body.role).then(
               (value) => {
                  res.status(200).send(value);
               }
            );
         } else {
            res.status(401).send();
         }
      } else {
         res.status(401).send();
      }
   });
});

router.delete("/:id", (req, res, next) => {
   if (!req.params.id || !req.body.role) {
      res.status(400).send("Missing Fields");
      return;
   }
   const approve = req.query.approve === "true";
   const role = req.body.role as IRoleRequest;
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string) as string
   ) as any;
   console.log("params", req.params);
   console.log(req.body);
   UserData.findUserById(decoded.sub).then(async (user: IUser | null) => {
      if (user?._id) {
         console.log(user);

         const writeRole: IRole | undefined = await authChecker.checkAuthWrite(
            role.role.type,
            req.params.id,
            user.roles
         );

         console.log(writeRole);
         if (writeRole) {
            console.log(approve);
            if (approve) {
               console.log(role);
               UserData.findUserById(role.requesterId).then(
                  (user: IUser | null) => {
                     console.log(user);
                     if (user?._id) {
                        const roles = user.roles;
                        roles.push(role.role);
                        user.roles = roles;
                        UserData.updateUserById(user?._id, user).then((_) => {
                           RoleRequestData.deleteById(req.params.id).then(
                              (_) => {
                                 res.status(200).send("Deleted");
                              }
                           );
                        });
                     } else {
                        res.status(400).send("Could Not Approve Role");
                        return;
                     }
                  }
               );
            } else {
               console.log("here");
               RoleRequestData.deleteById(req.params.id).then((_) => {
                  res.status(200).send("Deleted");
               });
            }
         } else {
            res.status(401).send();
         }
      } else {
         res.status(401).send();
      }
   });
});

router.get("/pendingApproval", (req, res, next) => {
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string) as string
   ) as any;
   UserData.findUserById(decoded.sub).then((user: IUser | null) => {
      if (user?._id) {
         RoleRequestData.findByOwnerId(user.id).then((value) => {
            res.status(200).send(JSON.stringify(value));
         });
      } else {
         res.status(401).send();
      }
   });
});

router.get("/myRequests", (req, res, next) => {
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string) as string
   ) as any;
   UserData.findUserById(decoded.sub).then((user: IUser | null) => {
      if (user?._id) {
         RoleRequestData.findByRequesterId(user.id).then((value) => {
            res.status(200).send(JSON.stringify(value));
         });
      } else {
         res.status(401).send();
      }
   });
});

const roleRequestRouter = router;
export default roleRequestRouter;
