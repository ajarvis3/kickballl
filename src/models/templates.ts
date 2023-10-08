import mongoose from "mongoose";
import ILineup from "./types/lineup";

const LineupSchema = new mongoose.Schema<ILineup>(
   {
      _id: {
         type: String,
      },
      teamName: {
         type: String,
         required: true,
      },
      lineup: {
         type: [{ type: String }],
         required: true,
      },
   },
   { _id: false }
);

const Lineup: mongoose.Model<ILineup> = mongoose.model("Lineup", LineupSchema);
export default Lineup;
