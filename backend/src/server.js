require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const departmentRoutes = require("./routes/departmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const nurseRoutes = require("./routes/nurseRoutes");
const patientRoutes = require("./routes/patientRoutes");
const treatmentRoutes = require("./routes/treatmentRoutes");
const roomRoutes = require("./routes/roomRoutes");
const billRoutes = require("./routes/billRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hospital Management API is running",
  });
});
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  })
);
app.use("/api/departments", departmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/nurses", nurseRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bills", billRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});