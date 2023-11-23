import ITemplate from "../../models/types/templates";
import TemplateData from "../../utils/db/templates/TemplateData";
import MyError from "../../types/Error";
import express, { NextFunction } from "express";
import IOutcome from "../../models/types/outcome";

const router = express.Router();

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
      !req.body.inningSlaughterRuleEffectiveLastLicks ||
      !req.body.gameSlaughterRule ||
      !req.body.gameSlaughterEffectiveInning ||
      !req.body.outcomes ||
      !req.body.maxInnings
   ) {
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
