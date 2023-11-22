import ITemplate from "../../models/types/templates";
import TemplateData from "../../utils/db/templates/TemplateData";
import MyError from "../../types/Error";
import express, { NextFunction } from "express";

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
      TemplateData.createAndSaveTemplate(
         req.body.name,
         req.body.countTypes,
         req.body.inningSlaughterRule,
         req.body.inningSlaughterRuleEffectiveLastLicks,
         req.body.gameSlaughterRule,
         req.body.gameSlaughterEffectiveInning,
         req.body.outcomes,
         req.body.maxInnings
      ).then((template: ITemplate) => {
         res.status(200).send(JSON.stringify(template));
      });
   }
});

// /templates/:id?
router.get("/:id?", (req: any, res: any, next: NextFunction) => {
   if (req.params.id) {
      res.status(200).send(
         JSON.stringify(TemplateData.getTemplateById(req.params.id))
      );
   } else {
      TemplateData.getAllTemplates().then((templates: ITemplate[]) => {
         res.status(200).send(JSON.stringify(templates));
      });
   }
});

const templatesRouter = router;
export default templatesRouter;
