declare global {
   namespace NodeJS {
      interface ProcessEnv {
         NODE_ENV: "development" | "production";
         DBNAME: string;
         DB_HOST: string;
         DB_PORT: string;
         DB_USER: string;
         DB_PASSWORD: string;
         secret: string;
      }
   }
}

export {};
