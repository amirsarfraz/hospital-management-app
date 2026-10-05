require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require(
  "swagger-ui-express"
);

const swaggerSpec = require(
  "./config/swagger-generated.json"
);

const departmentRoutes = require(
  "./routes/departmentRoutes"
);

const adminUserRoutes = require(
  "./routes/adminUserRoutes"
);

const dashboardRoutes = require(
  "./routes/dashboardRoutes"
);

const doctorRoutes = require(
  "./routes/doctorRoutes"
);

const nurseRoutes = require(
  "./routes/nurseRoutes"
);

const patientRoutes = require(
  "./routes/patientRoutes"
);

const treatmentRoutes = require(
  "./routes/treatmentRoutes"
);

const roomRoutes = require(
  "./routes/roomRoutes"
);

const billRoutes = require(
  "./routes/billRoutes"
);

const authRoutes = require(
  "./routes/authRoutes"
);

const nurseRoomRoutes = require(
  "./routes/nurseRoomRoutes"
);

const patientRoomRoutes = require(
  "./routes/patientRoomRoutes"
);

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
    origin: (origin, callback) => {
      // Swagger, Postman and
      // server-to-server requests
      if (!origin) {
        return callback(
          null,
          true
        );
      }

      if (
        allowedOrigins.includes(
          origin
        )
      ) {
        return callback(
          null,
          true
        );
      }

      return callback(
        new Error(
          `CORS blocked origin: ${origin}`
        )
      );
    },

    credentials: true,
  })
);

// ==============================
// MIDDLEWARE
// ==============================

app.use(express.json());

// ==============================
// ROOT
// ==============================

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Hospital Management API is running",
  });
});

// ==============================
// SWAGGER JSON
// ==============================

app.get(
  "/api-docs.json",
  (req, res) => {
    res
      .status(200)
      .json(swaggerSpec);
  }
);

// ==============================
// SWAGGER UI
// ==============================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerSpec,
    {
      customSiteTitle:
        "City Care Hospital API",

      swaggerOptions: {
        defaultModelsExpandDepth:
          -1,

        persistAuthorization:
          true,

        displayRequestDuration:
          true,

        tryItOutEnabled:
          true,
      },
    }
  )
);

// ==============================
// API ROUTES
// ==============================

app.use(
  "/api/departments",
  departmentRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/doctors",
  doctorRoutes
);

app.use(
  "/api/nurses",
  nurseRoutes
);

app.use(
  "/api/patients",
  patientRoutes
);

app.use(
  "/api/treatments",
  treatmentRoutes
);

app.use(
  "/api/rooms",
  roomRoutes
);

app.use(
  "/api/bills",
  billRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/admin/users",
  adminUserRoutes
);

app.use(
  "/api/nurse-rooms",
  nurseRoomRoutes
);

app.use(
  "/api/patient-rooms",
  patientRoomRoutes
);

// ==============================
// 404
// ==============================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ==============================
// ERROR HANDLER
// ==============================

app.use(
  (error, req, res, next) => {
    console.error(
      "Server error:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Internal server error",
    });
  }
);

// ==============================
// LOCAL SERVER
// ==============================

if (
  process.env.NODE_ENV !==
  "production"
) {
  const PORT =
    process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      `Swagger UI: http://localhost:${PORT}/api-docs`
    );

    console.log(
      `Swagger JSON: http://localhost:${PORT}/api-docs.json`
    );
  });
}

// ==============================
// VERCEL EXPORT
// ==============================

module.exports = app;