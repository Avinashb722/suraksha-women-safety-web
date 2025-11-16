const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working', timestamp: new Date() });
});

app.use("/api/v1/users", userRoutes);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        console.log('MongoDB Connected Successfully!');
    } catch (err) {
        console.log('MongoDB connection failed:', err.message);
        console.log('Server will start without database connection');
    }
    
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
        console.log(`Test URL: http://localhost:${port}/test`);
        console.log(`Verification endpoint: http://localhost:${port}/api/v1/users/emailverify/[token]`);
    });
};

start();