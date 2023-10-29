import mongoose from "mongoose";
import { OutcomeSchema } from "./outcome";
import ITemplate from "./types/templates";

const TemplateSchema = new mongoose.Schema<ITemplate>(
   {
      _id: {
         type: String,
      },
      countTypes: {
         type: [String],
         required: true,
      },
      inningSlaughterRule: {
         type: Number,
      },
      inningSlaughterRuleEffectiveLastLicks: {
         type: Boolean,
      },
      gameSlaughterRule: {
         type: Number,
      },
      gameSlaughterEffectiveInning: {
         type: Number,
      },
      outcomes: {
         type: [OutcomeSchema],
         required: true,
      },
      maxInnings: {
         type: Number,
         required: true,
      },
   },
   { _id: false }
);
export { TemplateSchema };

const Template: mongoose.Model<ITemplate> = mongoose.model(
   "Template",
   TemplateSchema
);
export default Template;
