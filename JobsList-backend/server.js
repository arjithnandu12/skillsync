const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connectdb = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      // Allow localhost, render domains, and vercel domains
      return callback(null, true);
    },
    credentials: true,
  })
);

connectdb();

app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});