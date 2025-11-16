const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./database/db");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const incRoutes = require("./routes/incidentRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const chatRoutes = require('./routes/chatRoutes')
const feedbackRoutes = require('./routes/feedbackRoutes')
const chatbotRoutes = require('./routes/chatbotRoutes')
const trackingRoutes = require('./routes/trackingRoutes')
const dataSourcesRoutes = require('./routes/dataSourcesRoutes')
const smsRoutes = require('./routes/smsRoutes')
const testEmergencyRoutes = require('./routes/testEmergencyRoutes')
const routeRoutes = require('./routes/routeRoutes')
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log(`Mongo Connected!!!`);
  } catch (err) {
    console.log('MongoDB connection failed:', err.message);
    console.log('Server will start without database connection');
  }
  
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incidents", incRoutes);
app.use("/api/v1/emergency", emergencyRoutes);
app.use('/api/v1/chats',chatRoutes)
app.use('/api/feedback',feedbackRoutes)
app.use('/api/v1/chatbot',chatbotRoutes)
app.use('/api/v1/tracking',trackingRoutes)
app.use('/api/v1/data-sources',dataSourcesRoutes)
app.use('/api/v1/sms',smsRoutes)
app.use('/api/v1/test-emergency',testEmergencyRoutes)
app.use('/api/v1/routes',routeRoutes)

app.use(errorHandler);

start();
