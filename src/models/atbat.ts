import mongoose from "mongoose";
import Outcome from "./outcome";
import IAtBat from "./types/atbat";

const AtBatSchema = new mongoose.Schema<IAtBat>({
   _id: {
      type: String,
   },
   gameId: {
      type: String,
      required: true,
   },
   count: {
      type: [{ type: Number }],
      required: true,
   },
   outcome: {
      type: Outcome,
   },
   timeUpdated: {
      type: Number,
      required: true,
   },
});

const AtBat: mongoose.Model<IAtBat> = mongoose.model("AtBat", AtBatSchema);
export default AtBat;
