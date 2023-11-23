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
   if (atBat === undefined) return false;
   for (let condField of this.conditionFields) {
      // Get index of templated count type
      let countTypeInd = this.countTypes.indexOf(condField.countType);
      // get the number required for a count to be applicable
      let countReq = condField.countNumberReq;
      // get number of count from at bad
      let countNum = atBat.count[countTypeInd];
      if (countNum !== countReq) {
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
