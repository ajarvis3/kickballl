import express from "express";
import ILeague from "../../models/types/league";
import LeaguesData from "../../utils/db/leagues/LeaguesData";

const router = express.Router();

router.get("/", (req, res, next) => {
   LeaguesData.findAll().then((value: ILeague[] | undefined) => {
      if (value) {
         const namesOnly = value.map((val: ILeague) => val.leagueName);
         console.log(namesOnly);
         res.status(200).send(JSON.stringify(namesOnly));
      }
   });
});

const readLeaguesRouter = router;
export default readLeaguesRouter;
