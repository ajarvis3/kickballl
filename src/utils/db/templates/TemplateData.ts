import Template from "../../../models/templates";
import { v4 as uuidv4 } from "uuid";
import IOutcome from "../../../models/types/outcome";
import ITemplate from "../../../models/types/templates";

class TemplateData {
   createTemplate = (
      countTypes: string[],
      inningSlaughterRule: number | null,
      inningSlaughterRuleEffectiveLastLicks: boolean | null,
      gameSlaughterRule: number | null,
      gameSlaughterEffectiveInning: number | null,
      outcomes: IOutcome[],
      maxInnings: number
   ) => {
      const _id = uuidv4();
      return new Template({
         _id,
         countTypes,
         inningSlaughterRule,
         inningSlaughterRuleEffectiveLastLicks,
         gameSlaughterRule,
         gameSlaughterEffectiveInning,
         outcomes,
         maxInnings,
      });
   };
   saveTemplate = (template: ITemplate) => {
      return template.save();
   };
   createAndSaveTemplate = (
      countTypes: string[],
      inningSlaughterRule: number | null,
      inningSlaughterRuleEffectiveLastLicks: boolean | null,
      gameSlaughterRule: number | null,
      gameSlaughterEffectiveInning: number | null,
      outcomes: IOutcome[],
      maxInnings: number
   ): Promise<ITemplate> => {
      return this.saveTemplate(
         this.createTemplate(
            countTypes,
            inningSlaughterRule,
            inningSlaughterRuleEffectiveLastLicks,
            gameSlaughterRule,
            gameSlaughterEffectiveInning,
            outcomes,
            maxInnings
         )
      );
   };
   getAllTemplates = () => {
      return Template.find().exec();
   };
   findById = (id: string) => {
      return Template.findById({ id: id }).cursor().next();
   };
   getTemplateById = (id: string) => {
      return Template.findById(id).cursor().next();
   };
}

export default new TemplateData();
