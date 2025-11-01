import 'dotenv/config';
import express from "express";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js"
import userRoute from "./routes/userRoute.js"
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5001;


// middlewares
app.use(express.json());
app.use(cookieParser())

// public routes
app.use('/api/auth', authRoute);

// private routes
app.use(protectedRoute)
app.use('/api/users', userRoute)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`);
    });
});