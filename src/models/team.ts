import mongoose from "mongoose";
import ITeam from "./types/team";

const TeamSchema = new mongoose.Schema<ITeam>(
   {
      _id: {
         type: String,
      },
      owner: {
         type: String,
         required: true,
      },
      leagueId: {
         type: String,
         required: true,
      },
      name: {
         type: String,
         required: true,
      },
   },
   { _id: false }
);
export { TeamSchema };

const Team: mongoose.Model<ITeam> = mongoose.model("Team", TeamSchema);
export default Team;
