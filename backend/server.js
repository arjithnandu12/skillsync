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
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://jobby-frontend.onrender.com",
    ],
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