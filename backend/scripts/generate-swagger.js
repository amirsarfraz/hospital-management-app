require("dotenv").config();

const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

// ==========================================
// ROUTES DIRECTORY
// ==========================================

const routesPath = path.resolve(
  __dirname,
  "../routes"
);

const swaggerApisPath = path.join(
  routesPath,
  "*.js"
);

console.log(
  "Swagger routes directory:",
  routesPath
);

console.log(
  "Swagger API pattern:",
  swaggerApisPath
);

// ==========================================
// SERVERS
// ==========================================

const servers = [
  {
    url: "http://localhost:5000",
    description:
      "Local development server",
  },
];

if (process.env.BACKEND_URL) {
  servers.push({
    url: process.env.BACKEND_URL,
    description:
      "Production server",
  });
}

// ==========================================
// SWAGGER OPTIONS
// ==========================================

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title:
        "City Care Hospital API",

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
              example:
                "Lahore, Pakistan",
            },

            phone_number: {
              type: "string",
              example:
                "03001234567",
            },
          },
        },
      },
    },
  },

  // ========================================
  // ROUTE FILES CONTAINING @swagger COMMENTS
  // ========================================

  apis: [
    swaggerApisPath,
  ],
};

// ==========================================
// GENERATE SPEC
// ==========================================

const swaggerSpec =
  swaggerJsdoc(options);

// ==========================================
// DEBUG
// ==========================================

console.log(
  "Swagger discovered paths:",
  Object.keys(
    swaggerSpec.paths || {}
  )
);

// ==========================================
// EXPORT
// ==========================================

module.exports =
  swaggerSpec;