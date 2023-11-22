import mongoose from "mongoose";
import IAtBat from "./atbat";

interface IOutcome extends mongoose.Document {
   _id: string;
   name: string; // e.g. walk, strikeout
   countTypes: string[]; // e.g. ball, strike, foul
   conditionFields: { countType: string; countNumberReq: number }[];
   testOutcome: (atbat: IAtBat) => boolean;
   __v: number;
}

export default IOutcome;
