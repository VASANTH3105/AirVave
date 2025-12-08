require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const telemetryRoutes = require("./routes/telemetryRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Routes
app.use("/api", telemetryRoutes);
app.use("/api", require("./routes/enrollmentRoutes"));


// Default route
app.get("/", (req, res) => {
  res.send("AirVave MDM Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
