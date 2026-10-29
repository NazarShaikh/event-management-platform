
const express = require("express");
const router = express.Router();

const {
  registerForEvent,
  getMyRegistrations,
    getAttendeeDashboard,
  cancelRegistration,
   getEventAttendees,
} = require("../controllers/registrationController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Register for an event
router.post(
  "/:eventId",
  protect,
  authorizeRoles("attendee"),
  registerForEvent
);

// View the logged-in attendee's registrations
router.get(
  "/my",
  protect,
  authorizeRoles("attendee"),
  getMyRegistrations
);

// Cancel a registration
router.patch(
  "/:registrationId/cancel",
  protect,
  authorizeRoles("attendee"),
  cancelRegistration
);

router.get(
  "/my/dashboard",
  protect,
  authorizeRoles("attendee"),
  getAttendeeDashboard
);

router.get(
  "/event/:eventId/attendees",
  protect,
  authorizeRoles("organizer"),
  getEventAttendees
);


module.exports = router;
