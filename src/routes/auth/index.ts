import express from "express";
import userRouter from "./oauth";

const router = express.Router();

router.use("/", userRouter);

const authRouter = router;
export default authRouter;
