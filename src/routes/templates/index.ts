import ITemplate from "../../models/types/templates";
import TemplateData from "../../utils/db/templates/TemplateData";
import MyError from "../../types/Error";
import express, { NextFunction } from "express";
import IOutcome from "../../models/types/outcome";
import TemplateAuthChecker from "../../utils/auth/hierarchy/TemplateAuthChecker";
import UserData from "../../utils/db/users/UserData";
import jwt from "jsonwebtoken";
import getToken from "../../utils/auth/getToken";

const router = express.Router();

const authChecker = new TemplateAuthChecker();

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
   console.log("params, ", req.params);
   authChecker.checkTokenPermissions("template", req, res, next);
});

router.post("/", (req, res, next) => {
   if (
      !req.body.name ||
      !req.body.countTypes ||
      !req.body.inningSlaughterRule ||
      req.body.inningSlaughterRuleEffectiveLastLicks === undefined ||
      !req.body.gameSlaughterRule ||
      !req.body.gameSlaughterEffectiveInning ||
      !req.body.outcomes ||
      !req.body.maxInnings ||
      req.body.league
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
      res.status(400).send();
      const decoded: any = jwt.decode(
         getToken(req.headers.authentication as string) as string
      ) as any;

      UserData.findUserById(decoded.sub).then((user) => {
         if (!user) res.status(401).send();
         authChecker
            .checkAuthWrite("league", req.body.league, user!.roles)
            .then((role) => {
               if (role && role._id) {
                  next();
               } else {
                  res.status(403).send();
               }
            });
      });
   }
});

// /templates
router.post("/", (req: any, res: any, next: NextFunction) => {
   // TODO: need to check write permissions
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
      const league: string = req.body.league ? req.body.league : "";
      outcomes.forEach((outcome) => {
         outcome.countTypes = countTypes;
      });
      const decoded: any = jwt.decode(
         getToken(req.headers.authentication as string) as string
      ) as any;

      TemplateData.createAndSaveTemplate(
         req.body.name,
         req.body.countTypes,
         req.body.inningSlaughterRule,
         req.body.inningSlaughterRuleEffectiveLastLicks,
         req.body.gameSlaughterRule,
         req.body.gameSlaughterEffectiveInning,
         outcomes,
         req.body.maxInnings,
         league,
         decoded.sub
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
   } else if (!req.query.league) {
      TemplateData.getAllTemplates().then((templates: ITemplate[]) => {
         res.status(200).send(JSON.stringify(templates));
      });
   } else {
      const leagueId = req.query.league;
      TemplateData.getTemplatesByLeagueId(leagueId).then(
         (templates: ITemplate[]) => {
            res.status(200).send(JSON.stringify(templates));
         }
      );
   }
});

const templatesRouter = router;
export default templatesRouter;
