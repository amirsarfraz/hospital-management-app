const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [
      patientsResult,
      doctorsResult,
      roomsResult,
      unpaidBillsResult,
      departmentsResult,
    ] = await Promise.all([
      supabase
        .from("patients")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("doctors")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("rooms")
        .select("*"),

      supabase
        .from("bills")
        .select("total_amount")
        .eq("payment_status", "unpaid"),

      supabase
        .from("departments")
        .select(`
          department_id,
          name,
          doctors(count)
        `),
    ]);

    if (patientsResult.error) throw patientsResult.error;
    if (doctorsResult.error) throw doctorsResult.error;
    if (roomsResult.error) throw roomsResult.error;
    if (unpaidBillsResult.error) throw unpaidBillsResult.error;
    if (departmentsResult.error) throw departmentsResult.error;

    const totalPatients = patientsResult.count || 0;
    const totalDoctors = doctorsResult.count || 0;

    const rooms = roomsResult.data || [];

    const availableRooms = rooms.filter(
      (room) => room.status === "available"
    ).length;

    const occupiedRooms = rooms.filter(
      (room) => room.status === "occupied"
    ).length;

    const unpaidBills = unpaidBillsResult.data || [];

    const unpaidBillsTotal = unpaidBills.reduce(
      (sum, bill) => sum + Number(bill.total_amount || 0),
      0
    );

    res.status(200).json({
      totalPatients,
      totalDoctors,
      availableRooms,
      occupiedRooms,
      unpaidBillsTotal,
      unpaidBillsCount: unpaidBills.length,
      departments: departmentsResult.data || [],
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to load dashboard data",
    });
  }
});

module.exports = router;