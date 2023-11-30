import mongoose from "mongoose";
import { AtBatSchema } from "./atbat";
import IGame from "./types/game";

const GameSchema = new mongoose.Schema<IGame>(
   {
      _id: {
         type: String,
      },
      ruleTemplateId: {
         type: String,
         required: true,
      },
      currInning: {
         type: Number,
         required: true,
      },
      isTopInning: {
         type: Boolean,
         required: true,
      },
      lineup1Id: {
         type: String,
         required: true,
      },
      lineup2Id: {
         type: String,
         required: true,
      },
      date: {
         type: Date,
         required: true,
      },
      atBatIds: {
         type: [{ type: AtBatSchema }],
         required: true,
      },
      score1: {
         type: [Number],
         required: true,
      },
      score2: {
         type: [Number],
         required: true,
      },
      currOuts: {
         type: Number,
         required: true,
      },
      owner: {
         type: String,
      },
   },
   { _id: false }
);
GameSchema.pre("findOneAndUpdate", function () {
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

const Game: mongoose.Model<IGame> = mongoose.model("Game", GameSchema);
export default Game;
