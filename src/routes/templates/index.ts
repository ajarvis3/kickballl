import ITemplate from "../../models/types/templates";
import TemplateData from "../../utils/db/templates/TemplateData";
import MyError from "../../types/Error";
import { NextFunction } from "express";

const router = express.Router();

router.post("/", (req: any, res: any, next: NextFunction) => {
   const failed = () => {
      const err = new MyError(400, "Bad Request");
   };
   if (
      !req.body.countTypes ||
      !req.body.inningSlaughterRule ||
      !req.body.inningSlaughterRuleEffectiveLastLicks ||
      !req.body.gameSlaughterRule ||
      !req.body.gameSlaughterEffectiveInning ||
      !req.body.outcomes ||
      !req.body.maxInnings
   ) {
      failed();
   } else {
      TemplateData.createAndSaveTemplate(
         req.body.countTypes,
         req.body.inningSlaughterRule,
         req.body.inningSlaughterRuleEffectiveLastLicks,
         req.body.gameSlaughterRule,
         req.body.gameSlaughterEffectiveInning,
         req.body.outcomes,
         req.body.maxInnings
      ).then((template: ITemplate) => {
         res.status(200).send(template);
      });
   }
});

router.get("/", (req: any, res: any, next: NextFunction) => {
   TemplateData.getAllTemplates().then((templates: ITemplate[]) => {
      res.status(200).send(templates);
   });
});

const templatesRouter = router;
export default templatesRouter;