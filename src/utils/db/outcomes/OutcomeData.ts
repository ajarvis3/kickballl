import { v4 as uuidv4 } from "uuid";
import Outcome from "../../../models/outcome";
import IOutcome from "../../../models/types/outcome";

class OutcomeData {
   createOutcome = (
      name: string,
      conditionFields: { countType: number; countNumberReq: number }[]
   ) => {
      const _id = uuidv4();
      return new Outcome({ _id, name, conditionFields });
   };
   saveOutcome = (outcome: IOutcome) => {
      return outcome.save();
   };
   createAndSaveOutcome = (
      name: string,
      conditionFields: { countType: number; countNumberReq: number }[]
   ) => {
      return this.saveOutcome(this.createOutcome(name, conditionFields));
   };
}

export default new OutcomeData();
