import express from "express"
import dotenv from"dotenv"
dotenv.config();
import { dbConnect } from "./config/dbConnect.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js"
import noteRouter from "./routes/noteRouter.js"
import tenantRouter from "./routes/tenantRouter.js"
import healthRouter from "./routes/healthRouter.js"

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

//database connection
dbConnect();

//routes defined
app.use('/api/users', userRouter);
app.use('/api/notes', noteRouter);
app.use('/api/tenants', tenantRouter);
app.use('/api/health', healthRouter)
app.get('/', (req, res)=> {
    res.send("API is running...")
})

export default app;