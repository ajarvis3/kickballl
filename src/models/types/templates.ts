import mongoose from "mongoose";
import IAtBat from "./atbat";
import IOutcome from "./outcome";

interface ITemplate extends mongoose.Document {
   _id: string;
   countTypes: string[]; // e.g. ball, strike, foul
   inningSlaughterRule: number | null;
   inningSlaughterRuleEffectiveLastLicks: boolean;
   gameSlaughterRule: number | null;
   gameSlaughterEffectiveInning: number | null;
   outcomes: IOutcome[];
   maxInnings: number;
   __v: number;
}

export default ITemplate;
