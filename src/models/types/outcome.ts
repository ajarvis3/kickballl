import mongoose from "mongoose";
import IAtBat from "./atbat";

interface IOutcome extends mongoose.Document {
   _id: string;
   name: string; // e.g. walk, strikeout
   conditionFields: { countType: number; countNumberReq: number }[];
   testOutcome: (atbat: IAtBat) => boolean;
   __v: number;
}

export default IOutcome;
