const express = require("express");

const { supabase } = require("../config/supabase");

const {
  requireAuth,
} = require("../middleware/authMiddleware");

const authorizeRoles = require(
  "../middleware/authorizeRoles"
);

const router = express.Router();

// Authentication required for every route
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Nurse Rooms
 *   description: Nurse room assignment management APIs
 */

/**
 * @swagger
 * /api/nurse-rooms:
 *   get:
 *     summary: Get all nurse room assignments
 *     tags:
 *       - Nurse Rooms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of nurse room assignments
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("nurse_rooms")
      .select(`
        nurse_room_id,
        nurse_id,
        room_number,
        assigned_at,
        nurses (
          nurse_id,
          first_name,
          last_name,
          shift_timing,
          contact_number
        ),
        rooms (
          room_number,
          room_type,
          daily_charge_rate,
          status
        )
      `)
      .order("assigned_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error(
      "GET nurse room assignments error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load nurse room assignments",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/nurse-rooms:
 *   post:
 *     summary: Assign a nurse to a room
 *     tags:
 *       - Nurse Rooms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nurse_id
 *               - room_number
 *             properties:
 *               nurse_id:
 *                 type: integer
 *                 example: 1
 *               room_number:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       201:
 *         description: Nurse assigned to room successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Nurse or room not found
 *       409:
 *         description: Assignment already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authorizeRoles("admin", "manager"),
  async (req, res) => {
    try {
      const {
        nurse_id,
        room_number,
      } = req.body;

      if (!nurse_id || !room_number) {
        return res.status(400).json({
          message:
            "nurse_id and room_number are required",
        });
      }

      // Check nurse exists
      const {
        data: nurse,
        error: nurseError,
      } = await supabase
        .from("nurses")
        .select("nurse_id")
        .eq("nurse_id", nurse_id)
        .maybeSingle();

      if (nurseError) {
        throw nurseError;
      }

      if (!nurse) {
        return res.status(404).json({
          message: "Nurse not found",
        });
      }

      // Check room exists
      const {
        data: room,
        error: roomError,
      } = await supabase
        .from("rooms")
        .select(
          "room_number, room_type, status"
        )
        .eq("room_number", room_number)
        .maybeSingle();

      if (roomError) {
        throw roomError;
      }

      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }

      // Check duplicate assignment
      const {
        data: existingAssignment,
        error: existingError,
      } = await supabase
        .from("nurse_rooms")
        .select("nurse_room_id")
        .eq("nurse_id", nurse_id)
        .eq("room_number", room_number)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (existingAssignment) {
        return res.status(409).json({
          message:
            "Nurse is already assigned to this room",
        });
      }

      // Create assignment
      const {
        data,
        error,
      } = await supabase
        .from("nurse_rooms")
        .insert([
          {
            nurse_id,
            room_number,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error(
        "Assign nurse to room error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to assign nurse to room",
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /api/nurse-rooms/{id}:
 *   delete:
 *     summary: Remove a nurse room assignment
 *     tags:
 *       - Nurse Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Nurse room assignment ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Nurse removed from room successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Nurse room assignment not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authorizeRoles("admin", "manager"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // First check assignment exists
      const {
        data: assignment,
        error: findError,
      } = await supabase
        .from("nurse_rooms")
        .select("nurse_room_id")
        .eq("nurse_room_id", id)
        .maybeSingle();

      if (findError) {
        throw findError;
      }

      if (!assignment) {
        return res.status(404).json({
          message:
            "Nurse room assignment not found",
        });
      }

      // Delete assignment
      const {
        error: deleteError,
      } = await supabase
        .from("nurse_rooms")
        .delete()
        .eq("nurse_room_id", id);

      if (deleteError) {
        throw deleteError;
      }

      return res.status(200).json({
        message:
          "Nurse removed from room successfully",
      });
    } catch (error) {
      console.error(
        "Remove nurse room assignment error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to remove nurse from room",
        error: error.message,
      });
    }
  }
);

module.exports = router;