const router = express.Router;

router.post("/", (req: any, res: any, next: NextFunction) => {
    const failed = () => {
        const err = new MyError(400, "Bad Request");
     };

});
