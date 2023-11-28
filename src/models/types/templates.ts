import mongoose from "mongoose";
import IAtBat from "./atbat";
import IOutcome from "./outcome";

interface ITemplate extends mongoose.Document {
   _id: string;
   name: string;
   countTypes: string[]; // e.g. ball, strike, foul
   inningSlaughterRule: number | null;
   inningSlaughterRuleEffectiveLastLicks: boolean | null;
   gameSlaughterRule: number | null;
   gameSlaughterEffectiveInning: number | null;
   outcomes: IOutcome[];
   maxInnings: number;
   league: string;
   __v: number;
}

export default ITemplate;
