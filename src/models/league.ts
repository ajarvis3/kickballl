import mongoose from "mongoose";
import ILeague from "./types/league";

const LeagueSchema = new mongoose.Schema<ILeague>(
   {
      _id: {
         type: String,
      },
      leagueName: {
         type: String,
         required: true,
      },
      owner: {
         type: String,
         required: true,
      },
   },
   { _id: false }
);
export { LeagueSchema };

const League: mongoose.Model<ILeague> = mongoose.model("League", LeagueSchema);
export default League;
