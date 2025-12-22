require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const telemetryRoutes = require("./routes/telemetryRoutes");
const notificationRoutes = require("./routes/notificationRoutes"); 
const callLogRoutes = require("./routes/callLogRoutes");
const smsRoutes = require("./routes/smsRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");



const app = express();
app.use(express.json());
app.use(cors());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Routes
app.use("/api", telemetryRoutes);
app.use("/api", notificationRoutes); 
app.use("/api", callLogRoutes);
app.use("/api", smsRoutes);
app.use("/api", require("./routes/enrollmentRoutes"));
app.use("/api", require("./routes/torchRoutes"));


// Default route
app.get("/", (req, res) => {
  res.send("AirVave MDM Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
