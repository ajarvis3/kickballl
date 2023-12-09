import mongoose from "mongoose";
import ILineup from "./types/lineup";

const LineupSchema = new mongoose.Schema<ILineup>({
   _id: {
      type: String,
   },
   teamId: {
      type: String,
      required: true,
   },
   lineup: {
      type: [{ type: String }],
      required: true,
   },
   owner: { type: String },
   team: { type: String },
});
export { LineupSchema };

const Lineup: mongoose.Model<ILineup> = mongoose.model("Lineup", LineupSchema);
export default Lineup;
