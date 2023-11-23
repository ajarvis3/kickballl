import IAtBat from "./atbat";
import ILineup from "./lineup";

interface IGameResponse {
   _id: string;
   ruleTemplateId: string;
   currInning: number;
   isTopInning: boolean;
   lineup1Id: string;
   lineup2Id: string;
   date: Date;
   atBatIds: IAtBat[];
   score1: number[];
   score2: number[];
   currOuts: number;
   __v: number;
   lineup1: ILineup | undefined;
   lineup2: ILineup | undefined;
}

export default IGameResponse;
