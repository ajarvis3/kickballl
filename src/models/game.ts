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
   },
   { _id: false }
);

const Game: mongoose.Model<IGame> = mongoose.model("Game", GameSchema);
export default Game;
