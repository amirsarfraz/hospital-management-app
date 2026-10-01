const express = require("express");

const { supabase } = require("../config/supabase");

const {
  requireAuth,
} = require("../middleware/authMiddleware");

const authorizeRoles = require(
  "../middleware/authorizeRoles"
);

const router = express.Router();

// Authentication required for every route in this file
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Patient Rooms
 *   description: Patient room assignment management APIs
 */

/**
 * @swagger
 * /api/patient-rooms:
 *   get:
 *     summary: Get all patient room assignments
 *     tags:
 *       - Patient Rooms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patient room assignments
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("patient_rooms")
      .select(`
        patient_room_id,
        patient_id,
        room_number,
        admitted_at,
        discharged_at,
        patients (
          patient_id,
          first_name,
          last_name,
          date_of_birth,
          gender,
          phone_number
        ),
        rooms (
          room_number,
          room_type,
          daily_charge_rate,
          status
        )
      `)
      .order("admitted_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error(
      "GET patient room assignments error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load patient room assignments",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/patient-rooms:
 *   post:
 *     summary: Assign a patient to a room
 *     tags:
 *       - Patient Rooms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - room_number
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *               room_number:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       201:
 *         description: Patient assigned successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Patient or room not found
 *       409:
 *         description: Patient already assigned or room unavailable
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authorizeRoles("admin", "manager"),
  async (req, res) => {
    try {
      const {
        patient_id,
        room_number,
      } = req.body;

      if (!patient_id || !room_number) {
        return res.status(400).json({
          message:
            "patient_id and room_number are required",
        });
      }

      // Make sure patient exists
      const {
        data: patient,
        error: patientError,
      } = await supabase
        .from("patients")
        .select("patient_id")
        .eq("patient_id", patient_id)
        .maybeSingle();

      if (patientError) {
        throw patientError;
      }

      if (!patient) {
        return res.status(404).json({
          message: "Patient not found",
        });
      }

      // Check whether patient already has
      // an active room assignment
      const {
        data: existingAssignment,
        error: existingError,
      } = await supabase
        .from("patient_rooms")
        .select("patient_room_id")
        .eq("patient_id", patient_id)
        .is("discharged_at", null)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (existingAssignment) {
        return res.status(409).json({
          message:
            "Patient is already assigned to a room",
        });
      }

      // Find requested room
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

      if (room.status !== "available") {
        return res.status(409).json({
          message: "Room is not available",
        });
      }

      // Create room assignment
      const {
        data: assignment,
        error: assignmentError,
      } = await supabase
        .from("patient_rooms")
        .insert([
          {
            patient_id,
            room_number,
          },
        ])
        .select()
        .single();

      if (assignmentError) {
        throw assignmentError;
      }

      // Mark room occupied
      const {
        error: roomUpdateError,
      } = await supabase
        .from("rooms")
        .update({
          status: "occupied",
        })
        .eq("room_number", room_number);

      if (roomUpdateError) {
        // Roll back assignment if room status
        // could not be updated
        await supabase
          .from("patient_rooms")
          .delete()
          .eq(
            "patient_room_id",
            assignment.patient_room_id
          );

        throw roomUpdateError;
      }

      return res.status(201).json(
        assignment
      );
    } catch (error) {
      console.error(
        "Assign patient room error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to assign patient to room",
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /api/patient-rooms/{id}/discharge:
 *   patch:
 *     summary: Discharge a patient from a room
 *     tags:
 *       - Patient Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Patient room assignment ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Patient discharged successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Active room assignment not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id/discharge",
  authorizeRoles("admin", "manager"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Find active assignment
      const {
        data: assignment,
        error: findError,
      } = await supabase
        .from("patient_rooms")
        .select("*")
        .eq("patient_room_id", id)
        .is("discharged_at", null)
        .maybeSingle();

      if (findError) {
        throw findError;
      }

      if (!assignment) {
        return res.status(404).json({
          message:
            "Active room assignment not found",
        });
      }

      // Discharge patient
      const {
        data: updatedAssignment,
        error: updateError,
      } = await supabase
        .from("patient_rooms")
        .update({
          discharged_at:
            new Date().toISOString(),
        })
        .eq("patient_room_id", id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Make room available again
      const {
        error: roomUpdateError,
      } = await supabase
        .from("rooms")
        .update({
          status: "available",
        })
        .eq(
          "room_number",
          assignment.room_number
        );

      if (roomUpdateError) {
        throw roomUpdateError;
      }

      return res.status(200).json({
        message:
          "Patient discharged successfully",
        assignment: updatedAssignment,
      });
    } catch (error) {
      console.error(
        "Discharge patient error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to discharge patient",
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /api/patient-rooms/{id}:
 *   delete:
 *     summary: Delete a patient room assignment
 *     tags:
 *       - Patient Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Patient room assignment ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient room assignment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authorizeRoles("admin", "manager"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        data: assignment,
        error: findError,
      } = await supabase
        .from("patient_rooms")
        .select("*")
        .eq("patient_room_id", id)
        .maybeSingle();

      if (findError) {
        throw findError;
      }

      if (!assignment) {
        return res.status(404).json({
          message:
            "Patient room assignment not found",
        });
      }

      const { error: deleteError } =
        await supabase
          .from("patient_rooms")
          .delete()
          .eq("patient_room_id", id);

      if (deleteError) {
        throw deleteError;
      }

      // If assignment was still active,
      // make its room available again.
      if (!assignment.discharged_at) {
        const {
          error: roomUpdateError,
        } = await supabase
          .from("rooms")
          .update({
            status: "available",
          })
          .eq(
            "room_number",
            assignment.room_number
          );

        if (roomUpdateError) {
          console.error(
            "Room status update error:",
            roomUpdateError
          );
        }
      }

      return res.status(200).json({
        message:
          "Patient room assignment deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete patient room assignment error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to delete patient room assignment",
        error: error.message,
      });
    }
  }
);

module.exports = router;