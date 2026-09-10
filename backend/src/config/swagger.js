const swaggerJsdoc = require("swagger-jsdoc");

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
                url: "http://localhost:5000",
                description: "Local development server",
            },
        ],

        components: {
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
                            example: "03001234567",
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
                            example: "Ahmed",
                        },
                        last_name: {
                            type: "string",
                            example: "Khan",
                        },
                        specialization: {
                            type: "string",
                            example: "Cardiologist",
                        },
                        years_experience: {
                            type: "integer",
                            example: 8,
                        },
                        contact_number: {
                            type: "string",
                            example: "03001111111",
                        },
                        department_id: {
                            type: "integer",
                            example: 1,
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
                            example: "Lahore",
                        },
                        phone_number: {
                            type: "string",
                            example: "03001234567",
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
                            example: "Fatima",
                        },
                        last_name: {
                            type: "string",
                            example: "Ali",
                        },
                        shift_timing: {
                            type: "string",
                            example: "Morning",
                        },
                        contact_number: {
                            type: "string",
                            example: "03009998888",
                        },
                        department_id: {
                            type: "integer",
                            example: 1,
                        },
                    },
                },

                Room: {
                    type: "object",

                    properties: {
                        room_number: {
                            type: "integer",
                            example: 101,
                        },

                        room_type: {
                            type: "string",
                            enum: [
                                "General",
                                "Private",
                                "ICU",
                            ],
                            example: "Private",
                        },

                        daily_charge_rate: {
                            type: "number",
                            format: "float",
                            example: 5000,
                        },

                        status: {
                            type: "string",
                            enum: [
                                "available",
                                "occupied",
                                "maintenance",
                            ],
                            example: "available",
                        },

                        created_at: {
                            type: "string",
                            format: "date-time",
                            example:
                                "2026-09-10T12:30:00Z",
                        },
                    },
                },

                Bill: {
                    type: "object",
                  
                    properties: {
                      bill_number: {
                        type: "integer",
                        example: 1,
                      },
                  
                      patient_id: {
                        type: "integer",
                        example: 1,
                      },
                  
                      total_amount: {
                        type: "number",
                        format: "float",
                        example: 8500,
                      },
                  
                      payment_status: {
                        type: "string",
                        enum: ["paid", "unpaid"],
                        example: "unpaid",
                      },
                  
                      date_issued: {
                        type: "string",
                        format: "date",
                        example: "2026-09-10",
                      },
                  
                      created_at: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-10T12:30:00Z",
                      },
                  
                      patients: {
                        type: "object",
                        nullable: true,
                  
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
                  
                          phone_number: {
                            type: "string",
                            example: "03001234567",
                          },
                        },
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
                            example: 2,
                        },

                        doctor_id: {
                            type: "integer",
                            example: 1,
                        },

                        treatment_date: {
                            type: "string",
                            format: "date",
                            example: "2026-09-10",
                        },

                        diagnosis: {
                            type: "string",
                            example: "High blood pressure",
                        },

                        medication: {
                            type: "string",
                            nullable: true,
                            example: "Amlodipine 5mg once daily",
                        },

                        created_at: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-10T12:30:00Z",
                        },

                        patients: {
                            type: "object",
                            nullable: true,
                            properties: {
                                patient_id: {
                                    type: "integer",
                                    example: 2,
                                },
                                first_name: {
                                    type: "string",
                                    example: "Ali",
                                },
                                last_name: {
                                    type: "string",
                                    example: "Hassan",
                                },
                                phone_number: {
                                    type: "string",
                                    example: "03001234567",
                                },
                            },
                        },

                        doctors: {
                            type: "object",
                            nullable: true,
                            properties: {
                                doctor_id: {
                                    type: "integer",
                                    example: 1,
                                },
                                first_name: {
                                    type: "string",
                                    example: "Ahmed",
                                },
                                last_name: {
                                    type: "string",
                                    example: "Khan",
                                },
                                specialization: {
                                    type: "string",
                                    example: "Cardiologist",
                                },
                                department_id: {
                                    type: "integer",
                                    example: 1,
                                },

                                departments: {
                                    type: "object",
                                    nullable: true,
                                    properties: {
                                        department_id: {
                                            type: "integer",
                                            example: 1,
                                        },
                                        name: {
                                            type: "string",
                                            example: "Cardiology",
                                        },
                                    },
                                },
                            },
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

    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;