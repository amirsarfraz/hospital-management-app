require("dotenv").config();

const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

// ==========================================
// SERVER URLS
// ==========================================

const servers = [
  {
    url: "http://localhost:5000",
    description: "Local development server",
  },
];

// Production URL from environment variable
if (process.env.BACKEND_URL) {
  servers.push({
    url: process.env.BACKEND_URL,
    description: "Production server",
  });
}

// ==========================================
// SWAGGER OPTIONS
// ==========================================

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "City Care Hospital API",
      version: "1.0.0",
      description:
        "API documentation for City Care Hospital Management System",
    },

    servers,

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        Department: {
          type: "object",
          properties: {
            department_id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Cardiology",
            },
            location: {
              type: "string",
              example: "First Floor",
            },
            contact_phone: {
              type: "string",
              nullable: true,
              example: "03001234567",
            },
          },
        },

        Patient: {
          type: "object",
          properties: {
            patient_id: {
              type: "integer",
              example: 1,
            },
            first_name: {
              type: "string",
              example: "Ali",
            },
            last_name: {
              type: "string",
              example: "Hassan",
            },
            date_of_birth: {
              type: "string",
              format: "date",
              example: "1994-05-10",
            },
            gender: {
              type: "string",
              example: "Male",
            },
            address: {
              type: "string",
              nullable: true,
              example: "Lahore, Pakistan",
            },
            phone_number: {
              type: "string",
              example: "03001234567",
            },
          },
        },
      },
    },
  },

  // IMPORTANT:
  // Absolute paths work reliably both locally
  // and during Vercel build.
  apis: [
    path.join(
      __dirname,
      "../routes/*.js"
    ),
  ],
};

const swaggerSpec =
  swaggerJsdoc(options);

module.exports = swaggerSpec;