import mongoose from "mongoose";
import IAtBat from "./types/atbat";
import IOutcome from "./types/outcome";

const ConditionFields = new mongoose.Schema({
   countType: Number,
   countNumberReq: Number,
});

const OutcomeSchema = new mongoose.Schema<IOutcome>({
   _id: {
      type: String,
   },
   name: {
      type: String,
   },
   conditionFields: {
      type: [ConditionFields],
   },
});

OutcomeSchema.methods.testOutcome = function (atBat: IAtBat) {
   for (let condField of this.conditionsFields) {
      let countReq = condField.countNumberReq;
      let countNum = atBat.count[condField.countType];
      if (countNum < countReq) {
         return false;
      }
   }
   return true;
};

const Outcome: mongoose.Model<IOutcome> = mongoose.model(
   "Outcome",
   OutcomeSchema
);
export default Outcome;
