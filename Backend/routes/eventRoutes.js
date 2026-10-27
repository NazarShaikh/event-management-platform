
const express = require("express");
const router = express.Router();

const {
  createEvent,
  getPublishedEvents,
  getEventById,
  publishEvent,
  updateEvent,
  cancelEvent,
  getOrganizerDashboard,
} = require("../controllers/eventController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getPublishedEvents);
router.patch(
  "/:eventId/publish",
  protect,
  authorizeRoles("organizer"),
  publishEvent
);
router.get("/:eventId", getEventById);
router.patch(
  "/:eventId",
  protect,
  authorizeRoles("organizer"),
  updateEvent
);
// Organizer-only route
router.post(
  "/",
  protect,
  authorizeRoles("organizer"),
  createEvent
);

router.patch(
  "/:eventId/cancel",
  protect,
  authorizeRoles("organizer"),
  cancelEvent
);

router.get(
  "/organizer/dashboard",
  protect,
  authorizeRoles("organizer"),
  getOrganizerDashboard
);
module.exports = router;
