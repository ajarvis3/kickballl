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
AtBatSchema.pre("findOneAndUpdate", function () {
   const update = this.getUpdate() as any;
   if (update.__v != null) {
      delete update.__v;
   }
   const keys = ["$set", "$setOnInsert"];
   for (const key of keys) {
      if (update[key] != null && update[key].__v != null) {
         delete update[key].__v;
         if (Object.keys(update[key]).length === 0) {
            delete update[key];
         }
      }
   }
   update.$inc = update.$inc || {};
   update.$inc.__v = 1;
});
export { AtBatSchema };

const AtBat: mongoose.Model<IAtBat> = mongoose.model("AtBat", AtBatSchema);
export default AtBat;
