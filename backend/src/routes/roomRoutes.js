const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management APIs
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags:
 *       - Rooms
 *     responses:
 *       200:
 *         description: List of all rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("room_number", {
        ascending: true,
      });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Get rooms error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/rooms/{roomNumber}:
 *   get:
 *     summary: Get room by room number
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: roomNumber
 *         required: true
 *         description: Room number
 *         schema:
 *           type: integer
 *           example: 101
 *     responses:
 *       200:
 *         description: Room details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.get("/:roomNumber", async (req, res) => {
  try {
    const { roomNumber } = req.params;

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_number", roomNumber)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Get room error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room
 *     tags:
 *       - Rooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_number
 *               - room_type
 *               - daily_charge_rate
 *               - status
 *             properties:
 *               room_number:
 *                 type: integer
 *                 example: 104
 *               room_type:
 *                 type: string
 *                 enum:
 *                   - General
 *                   - Private
 *                   - ICU
 *                 example: Private
 *               daily_charge_rate:
 *                 type: number
 *                 example: 5000
 *               status:
 *                 type: string
 *                 enum:
 *                   - available
 *                   - occupied
 *                   - maintenance
 *                 example: available
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Room already exists
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
  try {
    const {
      room_number,
      room_type,
      daily_charge_rate,
      status,
    } = req.body;

    if (
      !room_number ||
      !room_type ||
      daily_charge_rate === undefined ||
      !status
    ) {
      return res.status(400).json({
        message:
          "Room number, room type, daily charge rate and status are required",
      });
    }

    if (Number(daily_charge_rate) < 0) {
      return res.status(400).json({
        message:
          "Daily charge rate cannot be negative",
      });
    }

    const validStatuses = [
      "available",
      "occupied",
      "maintenance",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid room status",
      });
    }

    const { data: existingRoom } =
      await supabase
        .from("rooms")
        .select("room_number")
        .eq("room_number", room_number)
        .maybeSingle();

    if (existingRoom) {
      return res.status(409).json({
        message:
          "A room with this number already exists",
      });
    }

    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          room_number:
            Number(room_number),

          room_type,

          daily_charge_rate:
            Number(daily_charge_rate),

          status,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(201).json({
      message: "Room created successfully",
      room: data,
    });
  } catch (error) {
    console.error("Create room error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/rooms/{roomNumber}:
 *   put:
 *     summary: Update a room
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: roomNumber
 *         required: true
 *         schema:
 *           type: integer
 *           example: 101
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_type
 *               - daily_charge_rate
 *               - status
 *             properties:
 *               room_type:
 *                 type: string
 *                 enum:
 *                   - General
 *                   - Private
 *                   - ICU
 *                 example: ICU
 *               daily_charge_rate:
 *                 type: number
 *                 example: 12000
 *               status:
 *                 type: string
 *                 enum:
 *                   - available
 *                   - occupied
 *                   - maintenance
 *                 example: occupied
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.put("/:roomNumber", async (req, res) => {
  try {
    const { roomNumber } = req.params;

    const {
      room_type,
      daily_charge_rate,
      status,
    } = req.body;

    if (
      !room_type ||
      daily_charge_rate === undefined ||
      !status
    ) {
      return res.status(400).json({
        message:
          "Room type, daily charge rate and status are required",
      });
    }

    if (Number(daily_charge_rate) < 0) {
      return res.status(400).json({
        message:
          "Daily charge rate cannot be negative",
      });
    }

    const validStatuses = [
      "available",
      "occupied",
      "maintenance",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid room status",
      });
    }

    const { data: existingRoom } =
      await supabase
        .from("rooms")
        .select("room_number")
        .eq("room_number", roomNumber)
        .maybeSingle();

    if (!existingRoom) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const { data, error } = await supabase
      .from("rooms")
      .update({
        room_type,

        daily_charge_rate:
          Number(daily_charge_rate),

        status,
      })
      .eq("room_number", roomNumber)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Room updated successfully",
      room: data,
    });
  } catch (error) {
    console.error("Update room error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /api/rooms/{roomNumber}:
 *   delete:
 *     summary: Delete a room
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: roomNumber
 *         required: true
 *         schema:
 *           type: integer
 *           example: 101
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:roomNumber", async (req, res) => {
  try {
    const { roomNumber } = req.params;

    const {
      data: room,
      error: findError,
    } = await supabase
      .from("rooms")
      .select("room_number")
      .eq("room_number", roomNumber)
      .maybeSingle();

    if (findError) {
      return res.status(500).json({
        message: findError.message,
      });
    }

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("room_number", roomNumber);

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Delete room error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;