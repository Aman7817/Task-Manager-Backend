// Importing necessary dependencies
import express from "express";           
import cors from "cors";                 
import cookieParser from "cookie-parser"; 
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize an Express application
const app = express();
 
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
    origin: process.env.CORS_ORIGIN,    
    credentials: true                   
}));

// Middleware to parse JSON bodies
app.use(express.json({ limit: "20kb" }));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

// Serve static files
app.use(express.static('public'));

// Middleware to parse cookies
app.use(cookieParser());

// routes import 
import userRouter from './routes/user.routes.js';
import taskRouter from './routes/task.routes.js';
import syncRouter from './routes/sync.routes.js'; // NEW SYNC ROUTES

// routes declaration 
app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/sync", syncRouter); // NEW SYNC ROUTES

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "Task Sync API"
    });
});

// Export the app
export { app };