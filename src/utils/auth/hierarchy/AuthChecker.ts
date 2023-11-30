import { NextFunction } from "express";
import IRole from "../../../models/types/role";

interface IAuthChecker {
   checkAuth(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): IRole | undefined | Promise<IRole | undefined>;
   checkAuthWrite(
      entityType: string,
      entityId: string,
      roles: IRole[]
   ): IRole | undefined | Promise<IRole | undefined>;
   checkTokenExists(req: any, res: any, next: NextFunction): void;
   checkTokenValid(req: any, res: any, next: NextFunction): void;
   checkTokenPermissions(
      entityType: string,
      req: any,
      res: any,
      next: NextFunction
   ): void;
}

export default IAuthChecker;
