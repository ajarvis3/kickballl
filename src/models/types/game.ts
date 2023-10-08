import mongoose from "mongoose";
import IAtBat from "./atbat";

interface IGame extends mongoose.Document {
   _id: string;
   ruleTemplateId: string;
   currInning: number;
   isTopInning: boolean;
   lineup1Id: string;
   lineup2Id: string;
   date: Date;
   atBatIds: IAtBat[];
   __v: number;
}

export default IGame;
