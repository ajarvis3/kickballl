import express from "express";
import ILeague from "../../models/types/league";
import LeaguesData from "../../utils/db/leagues/LeaguesData";

const router = express.Router();

router.get("/", (req, res, next) => {
   LeaguesData.findAll().then((value: ILeague[] | undefined) => {
      if (value) {
         const namesIdsOnly = value.map((val: ILeague) => {
            return { _id: val._id, leagueName: val.leagueName };
         });
         res.status(200).send(JSON.stringify(namesIdsOnly));
      }
   });
});

const readLeaguesRouter = router;
export default readLeaguesRouter;
