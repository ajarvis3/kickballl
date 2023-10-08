import mongoose from "mongoose";

// VS Code reported that process was treated
// as a local variable
// so I'm just passing in the process now
function startMongo(process: NodeJS.Process) {
   const env = process.env.NODE_ENV || "development";

   let connString =
      "mongodb://" +
      process.env.DB_HOST +
      ":" +
      process.env.DB_PORT +
      "/" +
      process.env.DBNAME;
   let options: mongoose.ConnectOptions = {
      family: 4,
   };
   if (env === "production") {
      options = {
         ...options,
         user: process.env.DB_USER,
         pass: process.env.DB_PASSWORD,
      };
      connString += "?ssl=true&replicaSet=globaldb&retryWrites=false";
   } else if (process.env.DB_USER && process.env.DB_PASSWORD) {
      options = {
         ...options,
         authSource: "admin",
         user: process.env.DB_USER,
         pass: process.env.DB_PASSWORD,
      };
   }
   console.log("connection string: " + connString);
   console.log(
      "DB_USER=" +
         process.env.DB_USER +
         "\tDB_PASSWORD=" +
         process.env.DB_PASSWORD
   );
   mongoose
      .connect(connString, options)
      .then(() => console.log("Connection to Mongo successful"))
      .catch((err) => console.error(err));
}

const startDb = () => startMongo(process);
export default startDb;
