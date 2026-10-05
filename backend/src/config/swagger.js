const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

// ==============================
// SERVERS
// ==============================

const productionUrl =
    process.env.BACKEND_URL ||
    "https://hospital-management-app-opal.vercel.app";

// Important:
// Convert Windows backslashes to forward slashes
// so swagger-jsdoc glob works on Windows + Linux/Vercel.
const routesPath = path
    .resolve(process.cwd(), "src/routes/*.js")
    .replace(/\\/g, "/");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "City Care Hospital API",
            version: "1.0.0",
            description:
                "API documentation for City Care Hospital Management System",
        },

        servers: [
            {
                url: productionUrl,
                description: "Production server",
            },
            {
                url: "http://localhost:5000",
                description: "Local development server",
            },
        ],

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
                        created_at: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },

                Doctor: {
                    type: "object",
                    properties: {
                        doctor_id: {
                            type: "integer",
                            example: 1,
                        },
                        first_name: {
                            type: "string",
                            example: "Ali",
                        },
                        last_name: {
                            type: "string",
                            example: "Khan",
                        },
                        specialization: {
                            type: "string",
                            example: "Cardiology",
                        },
                        phone_number: {
                            type: "string",
                            example: "03001234567",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "doctor@example.com",
                        },
                        department_id: {
                            type: "integer",
                            example: 1,
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },

                Nurse: {
                    type: "object",
                    properties: {
                        nurse_id: {
                            type: "integer",
                            example: 1,
                        },
                        first_name: {
                            type: "string",
                            example: "Sara",
                        },
                        last_name: {
                            type: "string",
                            example: "Khan",
                        },
                        phone_number: {
                            type: "string",
                            example: "03001234567",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "nurse@example.com",
                        },
                        department_id: {
                            type: "integer",
                            example: 1,
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
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
                            enum: [
                                "Male",
                                "Female",
                                "Other",
                            ],
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
                        created_at: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },

                Treatment: {
                    type: "object",
                    properties: {
                        treatment_id: {
                            type: "integer",
                            example: 1,
                        },
                        patient_id: {
                            type: "integer",
                            example: 1,
                        },
                        doctor_id: {
                            type: "integer",
                            example: 1,
                        },
                        diagnosis: {
                            type: "string",
                            example: "Flu",
                        },
                        treatment_details: {
                            type: "string",
                            example: "Medication and rest",
                        },
                        treatment_date: {
                            type: "string",
                            format: "date",
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },

                Room: {
                    type: "object",
                    properties: {
                        room_id: {
                            type: "integer",
                            example: 1,
                        },
                        room_number: {
                            type: "string",
                            example: "101",
                        },
                        room_type: {
                            type: "string",
                            example: "General",
                        },
                        status: {
                            type: "string",
                            example: "available",
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },

                Bill: {
                    type: "object",
                    properties: {
                        bill_id: {
                            type: "integer",
                            example: 1,
                        },
                        bill_number: {
                            type: "string",
                            example: "BILL-001",
                        },
                        patient_id: {
                            type: "integer",
                            example: 1,
                        },
                        total_amount: {
                            type: "number",
                            format: "float",
                            example: 5000,
                        },
                        payment_status: {
                            type: "string",
                            example: "unpaid",
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },

                Error: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Something went wrong",
                        },
                    },
                },
            },
        },
    },

    // All Swagger comments inside src/routes/*.js
    // will be scanned from here.
    apis: [routesPath],
};

console.log(
    "Swagger scanning routes from:",
    routesPath
);

const swaggerSpec =
    swaggerJsdoc(options);

module.exports = swaggerSpec;