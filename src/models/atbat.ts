import mongoose from "mongoose";
import { OutcomeSchema } from "./outcome";
import IAtBat from "./types/atbat";

const AtBatSchema = new mongoose.Schema<IAtBat>(
   {
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
         type: OutcomeSchema,
      },
      timeUpdated: {
         type: Number,
         required: true,
      },
   },
   { _id: false }
);
export { AtBatSchema };

const AtBat: mongoose.Model<IAtBat> = mongoose.model("AtBat", AtBatSchema);
export default AtBat;
