import { NextFunction } from "express";
import IRole from "../../../models/types/role";

interface IAuthChecker {
   checkAuth(entityId: string, roles: IRole[]): IRole | undefined;
   checkAuthWrite(entityId: string, roles: IRole[]): IRole | undefined;
   checkTokenExists(req: any, res: any, next: NextFunction): void;
   checkTokenValid(req: any, res: any, next: NextFunction): void;
   checkTokenPermissions(req: any, res: any, next: NextFunction): void;
}

export default IAuthChecker;
