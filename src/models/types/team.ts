import mongoose from "mongoose";

interface ITeam extends mongoose.Document {
   _id: string;
   owner: string;
   leagueId: string;
   name: string;
   __v: number;
}

export default ITeam;
