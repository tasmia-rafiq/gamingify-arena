import "./config/env.js";

import app from "./app.js";
import connectDB from "./config/db.js"
import { redisClient } from "./config/redis.setup.js";

const port = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB();

        redisClient
            .connect()
            .then(() => console.log("Connected to redis."))
            .catch(console.error);

        app.on("error", (error) => {
            console.log("Error!", error);
            throw error;
        });

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    } catch (error) {
        console.log(`Server failed to start ${error}`);
    }
}

startServer();