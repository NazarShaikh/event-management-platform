
const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
// Create an event (organizers only)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      startDate,
      endDate,
      registrationDeadline,
      capacity,
      imageUrl,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !venue ||
      !startDate ||
      !endDate ||
      !registrationDeadline ||
      capacity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required event fields",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const deadline = new Date(registrationDeadline);
    const now = new Date();

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      Number.isNaN(deadline.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid event dates",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "Event end date must be on or after the start date",
      });
    }

    if (deadline > start) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline must be on or before the event starts",
      });
    }

    if (deadline <= now || start <= now) {
      return res.status(400).json({
        success: false,
        message: "New events must have a future registration deadline and start date",
      });
    }

    if (
      typeof capacity !== "number" ||
      !Number.isInteger(capacity) ||
      capacity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be a positive whole number",
      });
    }

    const event = await Event.create({
      title,
      description,
      category,
      venue,
      startDate: start,
      endDate: end,
      registrationDeadline: deadline,
      capacity,
      imageUrl,
      organizer: req.user.userId,
      status: "draft",
    });

    return res.status(201).json({
      success: true,
      message: "Event created as a draft",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create event",
    });
  }
};

// Get all published events (public)

const getPublishedEvents = async (req, res) => {
  try {
    const {
      search,
      category,
      venue,
      page = 1,
      limit = 10,
    } = req.query;

    // Validate pagination values
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      !Number.isInteger(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100",
      });
    }

    // Only return published events
    const filter = {
      status: "published",
    };

    // Search title or description
    if (search && search.trim()) {
      const escapedSearch = search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by venue
    if (venue && venue.trim()) {
      const escapedVenue = venue.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.venue = {
        $regex: escapedVenue,
        $options: "i",
      };
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [events, totalEvents] = await Promise.all([
      Event.find(filter)
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limitNumber)
        .select("-__v"),
      Event.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        totalEvents,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalEvents / limitNumber),
        limit: limitNumber,
      },
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get published events error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve events",
    });
  }
};


// Get details of one published event (public)
const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const event = await Event.findOne({
      _id: eventId,
      status: "published",
    }).select("-__v");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Published event not found",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve event",
    });
  }
};


const publishEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const event = await Event.findOne({
      _id: eventId,
      organizer: req.user.userId,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or you are not its organizer",
      });
    }

    if (event.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft events can be published",
      });
    }

    if (
      event.startDate <= new Date() ||
      event.registrationDeadline <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Event start date and registration deadline must be in the future",
      });
    }

    event.status = "published";
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event published successfully",
      event,
    });
  } catch (error) {
    console.error("Publish event error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to publish event",
    });
  }
};


const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "venue",
      "startDate",
      "endDate",
      "registrationDeadline",
      "capacity",
      "imageUrl",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    const event = await Event.findOne({
      _id: eventId,
      organizer: req.user.userId,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or you are not its organizer",
      });
    }

    if (event.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled events cannot be updated",
      });
    }

    // Validate capacity
    if (updates.capacity !== undefined) {
      if (
        typeof updates.capacity !== "number" ||
        !Number.isInteger(updates.capacity) ||
        updates.capacity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Capacity must be a positive whole number",
        });
      }

      if (updates.capacity < event.registeredCount) {
        return res.status(400).json({
          success: false,
          message:
            "Capacity cannot be lower than the current confirmed registrations",
        });
      }
    }

    // Convert supplied dates and validate them
    const dateFields = [
      "startDate",
      "endDate",
      "registrationDeadline",
    ];

    for (const field of dateFields) {
      if (updates[field] !== undefined) {
        const parsedDate = new Date(updates[field]);

        if (Number.isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: `Please provide a valid ${field}`,
          });
        }

        updates[field] = parsedDate;
      }
    }

    // Validate the final combination of old and new dates
    const startDate = updates.startDate ?? event.startDate;
    const endDate = updates.endDate ?? event.endDate;
    const registrationDeadline =
      updates.registrationDeadline ?? event.registrationDeadline;

    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        message: "Event end date must be on or after the start date",
      });
    }

    if (registrationDeadline > startDate) {
      return res.status(400).json({
        success: false,
        message:
          "Registration deadline must be on or before the event starts",
      });
    }

    // If any event date changes, require future start and deadline
    const datesChanged = dateFields.some(
      (field) => updates[field] !== undefined
    );

    if (
      datesChanged &&
      (startDate <= new Date() ||
        registrationDeadline <= new Date())
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Updated event start date and registration deadline must be in the future",
      });
    }

    // Apply only the permitted fields
    Object.assign(event, updates);
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Update event error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update event",
    });
  }
};



const cancelEvent = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { eventId } = req.params;

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    let cancelledEvent;

    await session.withTransaction(async () => {
      const event = await Event.findOne({
        _id: eventId,
        organizer: req.user.userId,
      }).session(session);

      if (!event) {
        const error = new Error(
          "Event not found or you are not its organizer"
        );
        error.statusCode = 404;
        throw error;
      }

      if (event.status === "cancelled") {
        const error = new Error("This event has already been cancelled");
        error.statusCode = 400;
        throw error;
      }

      if (event.startDate <= new Date()) {
        const error = new Error(
          "Events cannot be cancelled after they have started"
        );
        error.statusCode = 400;
        throw error;
      }

      await Registration.updateMany(
        {
          event: event._id,
          status: "confirmed",
        },
        { $set: { status: "cancelled" } },
        { session }
      );

      event.status = "cancelled";
      event.registeredCount = 0;

      await event.save({ session });

      cancelledEvent = event;
    });

    return res.status(200).json({
      success: true,
      message: "Event cancelled successfully",
      event: cancelledEvent,
    });
  } catch (error) {
    console.error("Cancel event error:", error.message);

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to cancel event",
    });
  } finally {
    await session.endSession();
  }
};




const getOrganizerDashboard = async (req, res) => {
  try {
    const organizerId = req.user.userId;

    const events = await Event.find({
      organizer: organizerId,
    })
      .select("title status startDate capacity registeredCount")
      .sort({ startDate: 1 });

    const totalEvents = events.length;

    const publishedEvents = events.filter(
      (event) => event.status === "published"
    ).length;

    const draftEvents = events.filter(
      (event) => event.status === "draft"
    ).length;

    const cancelledEvents = events.filter(
      (event) => event.status === "cancelled"
    ).length;

    const totalRegistrations = events.reduce(
      (total, event) => total + event.registeredCount,
      0
    );

    const upcomingEvents = events.filter(
      (event) =>
        event.status === "published" &&
        event.startDate > new Date()
    );

    return res.status(200).json({
      success: true,
      dashboard: {
        totalEvents,
        publishedEvents,
        draftEvents,
        cancelledEvents,
        totalRegistrations,
        upcomingEvents,
      },
    });
  } catch (error) {
    console.error("Organizer dashboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve organizer dashboard",
    });
  }
};


module.exports = {
  createEvent,
  getPublishedEvents,
  getEventById,
   publishEvent,
    updateEvent,
    cancelEvent,
      getOrganizerDashboard,
};
