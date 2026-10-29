
const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

// Register an attendee for an event
const registerForEvent = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { eventId } = req.params;
    const userId = req.user.userId;
    const now = new Date();

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    let result;

    await session.withTransaction(async () => {
      const event = await Event.findById(eventId).session(session);

      if (!event) {
        result = {
          status: 404,
          body: { success: false, message: "Event not found" },
        };
        return;
      }

      if (event.status !== "published") {
        result = {
          status: 400,
          body: {
            success: false,
            message: "This event is not open for registration",
          },
        };
        return;
      }

      if (
        now >= event.registrationDeadline ||
        now >= event.startDate
      ) {
        result = {
          status: 400,
          body: {
            success: false,
            message: "The registration deadline has passed",
          },
        };
        return;
      }

      let registration = await Registration.findOne({
        user: userId,
        event: eventId,
      }).session(session);

      if (registration && registration.status === "confirmed") {
        result = {
          status: 409,
          body: {
            success: false,
            message: "You are already registered for this event",
          },
        };
        return;
      }

      // Atomically reserve one seat if capacity remains.
      const updatedEvent = await Event.findOneAndUpdate(
        {
          _id: eventId,
          status: "published",
          registrationDeadline: { $gt: now },
          startDate: { $gt: now },
          $expr: { $lt: ["$registeredCount", "$capacity"] },
        },
        { $inc: { registeredCount: 1 } },
        { new: true, session }
      );

      if (!updatedEvent) {
        result = {
          status: 409,
          body: {
            success: false,
            message: "This event is full or registration has closed",
          },
        };
        return;
      }

      if (registration) {
        registration.status = "confirmed";
        registration.registeredAt = now;
        await registration.save({ session });
      } else {
        [registration] = await Registration.create(
          [
            {
              user: userId,
              event: eventId,
              status: "confirmed",
              registeredAt: now,
            },
          ],
          { session }
        );
      }

      result = {
        status: 201,
        body: {
          success: true,
          message: "Successfully registered for the event",
          registration,
        },
      };
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    console.error("Register for event error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to register for the event",
    });
  } finally {
    await session.endSession();
  }
};

// Get registrations belonging to the logged-in attendee
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user.userId,
    })
      .populate("event")
      .sort({ registeredAt: -1 });

    return res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error("Get registrations error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve registrations",
    });
  }
};


const getAttendeeDashboard = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user.userId,
    })
      .populate("event")
      .sort({ registeredAt: -1 });

    const now = new Date();

    const confirmedRegistrations = registrations.filter(
      (registration) => registration.status === "confirmed"
    );

    const cancelledRegistrations = registrations.filter(
      (registration) => registration.status === "cancelled"
    );

    const upcomingEvents = confirmedRegistrations.filter(
      (registration) =>
        registration.event &&
        registration.event.status === "published" &&
        registration.event.startDate > now
    );

    const pastEvents = confirmedRegistrations.filter(
      (registration) =>
        registration.event &&
        registration.event.endDate < now
    );

    return res.status(200).json({
      success: true,
      dashboard: {
        totalRegistrations: registrations.length,
        confirmedRegistrations: confirmedRegistrations.length,
        cancelledRegistrations: cancelledRegistrations.length,
        upcomingEvents,
        pastEvents,
      },
    });
  } catch (error) {
    console.error("Attendee dashboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve attendee dashboard",
    });
  }
};



// Cancel a registration within the allowed time window
const cancelRegistration = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { registrationId } = req.params;
    const userId = req.user.userId;
    const now = new Date();

    if (!mongoose.isValidObjectId(registrationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID",
      });
    }

    let result;

    await session.withTransaction(async () => {
      const registration = await Registration.findOne({
        _id: registrationId,
        user: userId,
      }).session(session);

      if (!registration) {
        result = {
          status: 404,
          body: {
            success: false,
            message: "Registration not found",
          },
        };
        return;
      }

      if (registration.status !== "confirmed") {
        result = {
          status: 400,
          body: {
            success: false,
            message: "This registration is already cancelled",
          },
        };
        return;
      }

      const event = await Event.findById(registration.event).session(session);

      if (!event) {
        result = {
          status: 404,
          body: {
            success: false,
            message: "Associated event not found",
          },
        };
        return;
      }

      if (now >= event.startDate) {
        result = {
          status: 400,
          body: {
            success: false,
            message: "Cancellation is not allowed after the event starts",
          },
        };
        return;
      }

      const cancellationDeadline = new Date(
        registration.registeredAt.getTime() + 24 * 60 * 60 * 1000
      );

      if (now > cancellationDeadline) {
        result = {
          status: 400,
          body: {
            success: false,
            message: "The 24-hour cancellation window has expired",
          },
        };
        return;
      }

      // Change the registration status only if it is still confirmed.
      const cancelledRegistration = await Registration.findOneAndUpdate(
        {
          _id: registrationId,
          user: userId,
          status: "confirmed",
        },
        { $set: { status: "cancelled" } },
        { new: true, session }
      );

      if (!cancelledRegistration) {
        result = {
          status: 409,
          body: {
            success: false,
            message: "Registration status changed. Please try again.",
          },
        };
        return;
      }

      await Event.updateOne(
        { _id: event._id, registeredCount: { $gt: 0 } },
        { $inc: { registeredCount: -1 } },
        { session }
      );

      result = {
        status: 200,
        body: {
          success: true,
          message: "Registration cancelled successfully",
          registration: cancelledRegistration,
        },
      };
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Cancel registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel registration",
    });
  } finally {
    await session.endSession();
  }
};


const getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.userId;

    // 1. Validate the event ID
    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    // 2. Find the event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 3. Verify that this organizer owns the event
    if (String(event.organizer) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these attendees",
      });
    }

    // 4. Get confirmed registrations and attendee details
    const registrations = await Registration.find({
      event: eventId,
      status: "confirmed",
    })
      .populate("user", "name email")
      .sort({ registeredAt: -1 });

    return res.status(200).json({
      success: true,
      event: {
        id: event._id,
        title: event.title,
        registeredCount: registrations.length,
      },
      count: registrations.length,
      attendees: registrations.map((registration) => ({
        registrationId: registration._id,
        name: registration.user?.name,
        email: registration.user?.email,
        registeredAt: registration.registeredAt,
        status: registration.status,
      })),
    });
  } catch (error) {
    console.error("Get event attendees error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve event attendees",
    });
  }
};


module.exports = {
  registerForEvent,
  getMyRegistrations,
   getAttendeeDashboard,
  cancelRegistration,
   getEventAttendees,
};
