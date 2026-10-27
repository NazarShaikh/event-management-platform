
const Review = require("../models/Review");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

const mongoose = require("mongoose");
// Create a review for an event
const createReview = async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      rating,
      organizationRating,
      experienceRating,
      venueRating,
      comment,
    } = req.body;

    const userId = req.user.userId;

    // 1. Validate the overall rating
    if (
      rating === undefined ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a whole number between 1 and 5",
      });
    }

    // 2. Validate optional category ratings
    const categoryRatings = {
      organizationRating,
      experienceRating,
      venueRating,
    };

    for (const [field, value] of Object.entries(categoryRatings)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (!Number.isInteger(value) || value < 1 || value > 5)
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a whole number between 1 and 5`,
        });
      }
    }

    // 3. Find the event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Reviews are not allowed for cancelled events",
      });
    }

    // 4. Check whether the event has ended
    if (!event.endDate || new Date(event.endDate) > new Date()) {
      return res.status(400).json({
        success: false,
        message: "You can review an event only after it has ended",
      });
    }

    // 5. Check the user's registration
    const registration = await Registration.findOne({
      user: userId,
      event: eventId,
      status: "confirmed",
    });

    if (!registration) {
      return res.status(403).json({
        success: false,
        message: "You must have a confirmed registration to review this event",
      });
    }

    // 6. Prevent duplicate reviews
    const existingReview = await Review.findOne({
      user: userId,
      event: eventId,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this event",
      });
    }

    // 7. Create the review
    const review = await Review.create({
      user: userId,
      event: eventId,
      rating,
      organizationRating,
      experienceRating,
      venueRating,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    // Handle duplicate-review race conditions
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this event",
      });
    }

    console.error("Create review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};

const getEventReviews = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const reviews = await Review.find({ event: eventId })
      .populate("user", "name")
      .select("-__v")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : Number(
            (
              reviews.reduce(
                (total, review) => total + review.rating,
                0
              ) / totalReviews
            ).toFixed(1)
          );

    return res.status(200).json({
      success: true,
      eventId,
      totalReviews,
      averageRating,
      reviews,
    });
  } catch (error) {
    console.error("Get event reviews error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve event reviews",
    });
  }
};

module.exports = { createReview,  getEventReviews, };
