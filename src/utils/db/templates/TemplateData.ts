import Template from "../../../models/templates";
import { v4 as uuidv4 } from "uuid";
import IOutcome from "../../../models/types/outcome";
import ITemplate from "../../../models/types/templates";

class TemplateData {
   createTemplate = (
      name: string,
      countTypes: string[],
      inningSlaughterRule: number | null,
      inningSlaughterRuleEffectiveLastLicks: boolean | null,
      gameSlaughterRule: number | null,
      gameSlaughterEffectiveInning: number | null,
      outcomes: IOutcome[],
      maxInnings: number,
      league: string,
      owner: string
   ) => {
      const _id = uuidv4();
      return new Template({
         _id,
         name,
         countTypes,
         inningSlaughterRule,
         inningSlaughterRuleEffectiveLastLicks,
         gameSlaughterRule,
         gameSlaughterEffectiveInning,
         outcomes,
         maxInnings,
         league,
         owner,
      });
   };
   saveTemplate = (template: ITemplate) => {
      return template.save();
   };
   createAndSaveTemplate = (
      name: string,
      countTypes: string[],
      inningSlaughterRule: number | null,
      inningSlaughterRuleEffectiveLastLicks: boolean | null,
      gameSlaughterRule: number | null,
      gameSlaughterEffectiveInning: number | null,
      outcomes: IOutcome[],
      maxInnings: number,
      league: string,
      owner: string
   ): Promise<ITemplate> => {
      return this.saveTemplate(
         this.createTemplate(
            name,
            countTypes,
            inningSlaughterRule,
            inningSlaughterRuleEffectiveLastLicks,
            gameSlaughterRule,
            gameSlaughterEffectiveInning,
            outcomes,
            maxInnings,
            league,
            owner
         )
      );
   };
   getAllTemplates = () => {
      return Template.find().exec();
   };
   findById = (id: string) => {
      return Template.findById(id).exec();
   };
   getTemplateById = (id: string) => {
      return Template.findById(id).exec();
   };
   getTemplatesByLeagueId = (leagueId: string) => {
      return Template.find({ league: leagueId }).exec();
   };
}

export default new TemplateData();
