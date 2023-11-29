import express from "express";
import getToken from "../../utils/auth/getToken";
import AdminAuthChecker from "../../utils/auth/hierarchy/AdminAuthChecker";
import jwt from "jsonwebtoken";
import IRole from "../../models/types/role";
import UserData from "../../utils/db/users/UserData";
import IUser from "../../models/types/user";
import RoleRequestData from "../../utils/db/rolerequests/RoleRequestData";
import IRoleRequest from "../../models/types/roleRequest";

const router = express.Router();

const authChecker = new AdminAuthChecker();

router.use("/", (req, res, next) => {
   authChecker.checkTokenExists(req, res, next);
});

router.use("/", (req, res, next) => {
   authChecker.checkTokenValid(req, res, next);
});

router.post("/", (req, res, next) => {
   if (!req.body.ownerId || !req.body.role) {
      res.status(400).send("Field Missing");
      return;
   }
   const decoded: any = jwt.decode(
      getToken(req.headers.authentication as string) as string
   ) as any;
   UserData.findUserById(decoded.sub).then((user: IUser | null) => {
      if (user?._id) {
         RoleRequestData.createAndSaveRole(
            user._id,
            req.body.ownerId,
            req.body.role
         ).then((value) => {
            res.status(200).send(JSON.stringify(value));
         });
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
   UserData.findUserById(decoded.sub).then((user: IUser | null) => {
      if (user?._id) {
         const writeRole: IRole | undefined = authChecker.checkAuthWrite(
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
   UserData.findUserById(decoded.sub).then((user: IUser | null) => {
      if (user?._id) {
         const writeRole: IRole | undefined = authChecker.checkAuthWrite(
            req.params.id,
            user.roles
         );
         if (writeRole) {
            if (approve) {
               UserData.findUserById(role.requesterId).then(
                  (user: IUser | null) => {
                     if (user?._id) {
                        const roles = user.roles;
                        roles.push(role.role);
                        user.roles = roles;
                        UserData.updateUserById(user?._id, user);
                     } else {
                        res.status(400).send("Could Not Approve Role");
                        return;
                     }
                     RoleRequestData.deleteById(req.params.id).then((_) => {
                        res.status(200).send("Deleted");
                     });
                  }
               );
            }
         } else {
            res.status(401).send();
         }
      } else {
         res.status(401).send();
      }
   });
});

const roleRequestRouter = router;
export default roleRequestRouter;
