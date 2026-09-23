const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard summary and statistics APIs
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: >
 *       Returns the main dashboard summary including total patients,
 *       total doctors, available rooms, occupied rooms, unpaid bills,
 *       departments, and recent patients.
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Dashboard data loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPatients:
 *                   type: integer
 *                   example: 25
 *                 totalDoctors:
 *                   type: integer
 *                   example: 8
 *                 availableRooms:
 *                   type: integer
 *                   example: 12
 *                 occupiedRooms:
 *                   type: integer
 *                   example: 5
 *                 unpaidBillsTotal:
 *                   type: number
 *                   format: float
 *                   example: 25000
 *                 unpaidBillsCount:
 *                   type: integer
 *                   example: 4
 *                 departments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 *                 recentPatients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Patient'
 *       500:
 *         description: Failed to load dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to load dashboard data
 *                 error:
 *                   type: string
 *                   example: Database query failed
 */

router.get("/", async (req, res) => {
  try {
    // Total patients
    const {
      count: patientCount,
      error: patientError,
    } = await supabase
      .from("patients")
      .select("*", {
        count: "exact",
        head: true,
      });

    if (patientError) {
      throw patientError;
    }

    // Total doctors
    const {
      count: doctorCount,
      error: doctorError,
    } = await supabase
      .from("doctors")
      .select("*", {
        count: "exact",
        head: true,
      });

    if (doctorError) {
      throw doctorError;
    }

    // Rooms
    const {
      data: rooms,
      error: roomError,
    } = await supabase
      .from("rooms")
      .select("*");

    if (roomError) {
      throw roomError;
    }

    // Unpaid bills
    const {
      data: unpaidBills,
      error: billError,
    } = await supabase
      .from("bills")
      .select("bill_number, total_amount")
      .eq("payment_status", "unpaid");

    if (billError) {
      throw billError;
    }

    // Departments
    const {
      data: departments,
      error: departmentError,
    } = await supabase
      .from("departments")
      .select("*")
      .order("department_id", {
        ascending: true,
      });

    if (departmentError) {
      throw departmentError;
    }

    // Recent patients
    const {
      data: recentPatients,
      error: recentPatientError,
    } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    if (recentPatientError) {
      throw recentPatientError;
    }

    const availableRooms =
      rooms?.filter(
        (room) => room.status === "available"
      ).length || 0;

    const occupiedRooms =
      rooms?.filter(
        (room) => room.status === "occupied"
      ).length || 0;

    const unpaidBillsTotal =
      unpaidBills?.reduce(
        (total, bill) =>
          total + Number(bill.total_amount),
        0
      ) || 0;

    res.status(200).json({
      totalPatients: patientCount || 0,
      totalDoctors: doctorCount || 0,

      availableRooms,
      occupiedRooms,

      unpaidBillsTotal,
      unpaidBillsCount:
        unpaidBills?.length || 0,

      departments:
        departments || [],

      recentPatients:
        recentPatients || [],
    });
  } catch (error) {
    console.error(
      "Dashboard API Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load dashboard data",

      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
});

module.exports = router;