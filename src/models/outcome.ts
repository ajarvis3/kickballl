import mongoose from "mongoose";
import IAtBat from "./types/atbat";
import IOutcome from "./types/outcome";

const ConditionFields = new mongoose.Schema({
   countType: String,
   countNumberReq: Number,
});

const OutcomeSchema = new mongoose.Schema<IOutcome>({
   _id: {
      type: String,
   },
   name: {
      type: String,
   },
   countTypes: {
      type: [String], // e.g. ball, strike, foul
   },
   conditionFields: {
      type: [ConditionFields],
   },
});

OutcomeSchema.methods.testOutcome = function (atBat: IAtBat) {
   for (let condField of this.conditionFields) {
      let countTypeInd = this.countTypes.indexOf(condField.countType);
      let countReq = condField.countNumberReq;
      let countNum = atBat.count[countTypeInd];
      if (countReq > 0 && countNum < countReq) {
         return false;
      } else if (countReq == 0 && countNum > countReq) {
         return false;
      }
   }
   return true;
};
export { OutcomeSchema };

const Outcome: mongoose.Model<IOutcome> = mongoose.model(
   "Outcome",
   OutcomeSchema
);
export default Outcome;
