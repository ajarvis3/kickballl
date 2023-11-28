import mongoose from "mongoose";

interface ILeague extends mongoose.Document {
   _id: string;
   leagueName: string;
   owner: string;
   __v: number;
}

export default ILeague;
