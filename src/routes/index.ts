import express from "express";
import authRouter from "./auth/index";
import gamesRouter from "./games/index";
import leaguesRouter from "./leagues/index";
import outcomesRouter from "./outcomes/index";
import templatesRouter from "./templates/index";

const router = express.Router();

router.use("/templates", templatesRouter);
router.use("/outcomes", outcomesRouter);
router.use("/games", gamesRouter);
router.use("/auth", authRouter);
router.use("/leagues", leaguesRouter);

const indexRouter = router;
export default indexRouter;
