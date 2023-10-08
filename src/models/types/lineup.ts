import mongoose from "mongoose";

interface ILineup extends mongoose.Document {
    _id: string;
    teamName: string;
    lineup: string[];
    __v: number;
}

export default ILineup;