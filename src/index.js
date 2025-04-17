// dotenv is used to load environment variables from a .env file into process.env
import dotenv from "dotenv";

// Importing the function to connect to the MongoDB database (you probably defined this elsewhere)
import connectDB from "./db/index.js";
import {app} from './app.js'

// Load environment variables from './env' file
dotenv.config({
    path: './env' // This will load the environment variables from the './env' file
})

// Connect to the database and then start the server if successful
connectDB()
    .then(() => {
        // If DB connection is successful, start the server on the given port (from environment variable or fallback to 8000)
        app.listen(process.env.PORT || 8000, () => {
            // Print a message saying the server is up and running
            console.log(`Server is running at Port: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        // If there's an error connecting to DB, log it
        console.log("MONGO DB connection failed!!!", err);
    });
