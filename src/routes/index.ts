import express from "express";
import gamesRouter from "./games/index";
import outcomesRouter from "./outcomes/index";
import templatesRouter from "./templates/index";

const router = express.Router();

router.use("/templates", templatesRouter);
router.use("/outcomes", outcomesRouter);
router.use("/games", gamesRouter);

const indexRouter = router;
export default indexRouter;
