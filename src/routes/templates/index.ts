import ITemplate from "../../models/types/templates";
import TemplateData from "../../utils/db/templates/TemplateData";
import MyError from "../../types/Error";
import express, { NextFunction } from "express";
import IOutcome from "../../models/types/outcome";
import TemplateAuthChecker from "../../utils/auth/hierarchy/TemplateAuthChecker";
import IUser from "../../models/types/user";
import UserData from "../../utils/db/users/UserData";
import IUserToken from "../../utils/auth/types/OAuthData";
import IRole from "../../models/types/role";
import jwt from "jsonwebtoken";
import getToken from "../../utils/auth/getToken";

const router = express.Router();

const authChecker = new TemplateAuthChecker();

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
   console.log("decoded", decoded);

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

// /templates
router.post("/", (req: any, res: any, next: NextFunction) => {
   const failed = () => {
      const err = new MyError(400, "Bad Request");
      return err;
   };
   if (
      !req.body.name ||
      !req.body.countTypes ||
      !req.body.inningSlaughterRule ||
      req.body.inningSlaughterRuleEffectiveLastLicks === undefined ||
      !req.body.gameSlaughterRule ||
      !req.body.gameSlaughterEffectiveInning ||
      !req.body.outcomes ||
      !req.body.maxInnings
   ) {
      console.error(
         "POST templates failed",
         req.body.name,
         req.body.countTypes,
         req.body.inningSlaughterRule,
         req.body.inningSlaughterRuleEffectiveLastLicks,
         req.body.gameSlaughterRule,
         req.body.gameSlaughterEffectiveInning,
         req.body.outcomes,
         req.body.maxInnings
      );
      res.status(400).send(JSON.stringify(failed()));
   } else {
      const outcomes: IOutcome[] = req.body.outcomes;
      const countTypes: string[] = req.body.countTypes;
      outcomes.forEach((outcome) => {
         outcome.countTypes = countTypes;
      });
      TemplateData.createAndSaveTemplate(
         req.body.name,
         req.body.countTypes,
         req.body.inningSlaughterRule,
         req.body.inningSlaughterRuleEffectiveLastLicks,
         req.body.gameSlaughterRule,
         req.body.gameSlaughterEffectiveInning,
         outcomes,
         req.body.maxInnings
      ).then((template: ITemplate) => {
         res.status(200).send(JSON.stringify(template));
      });
   }
});

// /templates/:id?
router.get("/:id?", (req: any, res: any, next: NextFunction) => {
   if (req.params.id) {
      console.log(req.params.id);
      TemplateData.getTemplateById(req.params.id).then((template) => {
         res.status(200).send(JSON.stringify(template));
      });
   } else {
      TemplateData.getAllTemplates().then((templates: ITemplate[]) => {
         res.status(200).send(JSON.stringify(templates));
      });
   }
});

const templatesRouter = router;
export default templatesRouter;
