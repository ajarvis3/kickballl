import { Request } from "express";

interface IAuthRequest extends Request {
   token: string;
}

export default IAuthRequest;
