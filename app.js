import express from "express"
import dotenv from"dotenv"
dotenv.config();
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());



app.get('/', (req, res)=> {
    res.send("API is running...")
})

export default app;