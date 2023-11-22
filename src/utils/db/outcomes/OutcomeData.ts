import { v4 as uuidv4 } from "uuid";
import Outcome from "../../../models/outcome";
import IOutcome from "../../../models/types/outcome";

class OutcomeData {
   createOutcome = (
      name: string,
      conditionFields: { countType: string; countNumberReq: number }[],
      countTypes: string
   ) => {
      const _id = uuidv4();
      return new Outcome({ _id, name, conditionFields });
   };
   saveOutcome = (outcome: IOutcome) => {
      return outcome.save();
   };
   createAndSaveOutcome = (
      name: string,
      conditionFields: { countType: string; countNumberReq: number }[],
      countTypes: string
   ) => {
      return this.saveOutcome(
         this.createOutcome(name, conditionFields, countTypes)
      );
   };
}

export default new OutcomeData();
