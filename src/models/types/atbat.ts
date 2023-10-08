import mongoose from "mongoose";
import IOutcome from "./outcome";

interface IAtBat extends mongoose.Document {
    _id: string;
    gameId: string;
    count: number[];
    outcome: IOutcome | null;
    timeUpdated: number;
    __v: number;
}

export default IAtBat;