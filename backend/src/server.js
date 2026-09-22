require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const departmentRoutes = require("./routes/departmentRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const nurseRoutes = require("./routes/nurseRoutes");
const patientRoutes = require("./routes/patientRoutes");
const treatmentRoutes = require("./routes/treatmentRoutes");
const roomRoutes = require("./routes/roomRoutes");
const billRoutes = require("./routes/billRoutes");
const authRoutes = require("./routes/authRoutes");


const app = express();

// ==============================
// CORS
// ==============================
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ==============================
// MIDDLEWARE
// ==============================
app.use(express.json());

// ==============================
// ROOT ROUTE
// ==============================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hospital Management API is running",
  });
});

// ==============================
// SWAGGER
// ==============================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  })
);

// ==============================
// API ROUTES
// ==============================
app.use("/api/departments", departmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/nurses", nurseRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/users",adminUserRoutes);

// ==============================
// LOCAL SERVER ONLY
// ==============================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Required for deployment platforms like Vercel
module.exports = app;