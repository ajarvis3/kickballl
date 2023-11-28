import express from "express";
import authRouter from "./auth";
import gamesRouter from "./games/index";
import outcomesRouter from "./outcomes/index";
import templatesRouter from "./templates/index";

const router = express.Router();

router.use("/templates", templatesRouter);
router.use("/outcomes", outcomesRouter);
router.use("/games", gamesRouter);
router.use("/auth", authRouter);

const indexRouter = router;
export default indexRouter;
