
const express = require("express");
const router = express.Router();

const {
  createReview,
  getEventReviews,
} = require("../controllers/reviewController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Get reviews for an event
router.get("/:eventId", getEventReviews);

// Submit a review — logged-in attendees only
router.post(
  "/:eventId",
  protect,
  authorizeRoles("attendee"),
  createReview
);

module.exports = router;
