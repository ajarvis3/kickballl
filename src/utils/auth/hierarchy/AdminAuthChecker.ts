import { NextFunction } from "express";
import IRole from "../../../models/types/role";
import IUser from "../../../models/types/user";
import UserData from "../../db/users/UserData";
import getToken from "../getToken";
import checkRoles from "../roleCheck";
import checkRolesWrite from "../roleCheckWrite";
import IAuthChecker from "./AuthChecker";
import jwt from "jsonwebtoken";

class AdminAuthChecker implements IAuthChecker {
   async checkAuth(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      console.log("adminAuthChecker", roles);
      return checkRoles("*", "*", roles);
   }

   async checkAuthWrite(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): Promise<IRole | undefined> {
      return checkRolesWrite("*", "*", roles);
   }

   checkTokenExists(req: any, res: any, next: NextFunction): void {
      if (!req.headers.authentication) {
         res.status(401).send();
      } else {
         next();
      }
   }

   checkTokenValid(req: any, res: any, next: NextFunction): void {
      const decoded: any = jwt.decode(
         getToken(req.headers.authentication as string) as string
      ) as any;

      UserData.findUserById(decoded.sub).then((user: IUser | null) => {
         user
            ?.verifyUser(
               getToken(req.headers.authentication as string) as string
            )
            .then((_) => {
               next();
            })
            .catch((e) => {
               res.status(401).send();
            });
      });
   }

   checkTokenPermissions(
      entityType: string,
      req: any,
      res: any,
      next: NextFunction
   ): void {
      const decoded: any = jwt.decode(
         getToken(req.headers.authentication as string) as string
      ) as any;
      const id = req.params.id ? req.params.id : "";

      UserData.findUserById(decoded.sub).then(async (user: IUser | null) => {
         if (user?._id) {
            this.checkAuth(entityType, id, user.roles).then((role) => {
               console.log("role", role);
               if (role && role._id) {
                  console.log("checkTokenPermissions", role);
                  if (typeof role === "undefined") {
                     res.status(403).send();
                  } else {
                     next();
                  }
               }
            });
         } else {
            res.status(401).send();
         }
      });
   }
}

export default AdminAuthChecker;
