import createError from "http-errors";
import express from "express";
import * as path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import indexRouter from "./routes/index";

import cors from "cors";

const app = express();
const port = process.env.PORT || 8080; // default port to listen

if (process.env.NODE_ENV !== "production") {
   app.use(cors());
   app.options("*", cors());
}

import engine from "consolidate";
import startDb from "./utils/db/connect";
import MyError from "./types/Error";

app.set("view engine", "html");
app.engine("html", engine.mustache);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

// routes
app.use("/", indexRouter);

dotenv.config();

// move to server.ts
startDb();

// catch 404 and forward to error handler
app.use((req, res, next) => {
   next(createError(404));
});

// error handler
app.use((err: Error, req: any, res: any, next: any) => {
   // set locals, only providing error in development
   if (err instanceof MyError) {
      res.status(err.status).send("{}");
   } else {
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(500);
      res.send("error");
   }
});

// start the Express server
app.listen(port, () => {
   console.log(`server started at http://localhost:${port}`);
});
