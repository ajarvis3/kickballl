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
   checkAuth(entityId: string, roles: IRole[]): IRole | undefined {
      console.log(roles);
      return checkRoles("*", "*", roles);
   }

   checkAuthWrite(entityId: string, roles: IRole[]): IRole | undefined {
      console.log(roles);
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

   checkTokenPermissions(req: any, res: any, next: NextFunction): void {
      const decoded: any = jwt.decode(
         getToken(req.headers.authentication as string) as string
      ) as any;
      const id = req.params.id ? req.params.id : "";

      UserData.findUserById(decoded.sub).then((user: IUser | null) => {
         if (user?._id) {
            const role: IRole | undefined = this.checkAuth(id, user.roles);
            if (typeof role === "undefined") {
               res.status(403).send();
            } else {
               next();
            }
         } else {
            res.status(401).send();
         }
      });
   }
}

export default AdminAuthChecker;
