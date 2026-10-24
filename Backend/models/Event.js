
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: [
        "Technology",
        "Business",
        "Education",
        "Workshop",
        "Entertainment",
        "Sports",
        "Other",
      ],
    },

    venue: {
      type: String,
      required: [true, "Event venue is required"],
      trim: true,
    },

    startDate: {
      type: Date,
      required: [true, "Event start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "Event end date is required"],
      validate: {
        validator: function (value) {
          return !this.startDate || value >= this.startDate;
        },
        message: "End date must be after the start date",
      },
    },

    registrationDeadline: {
      type: Date,
      required: [true, "Registration deadline is required"],
    },

    capacity: {
      type: Number,
      required: [true, "Event capacity is required"],
      min: [1, "Capacity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Capacity must be a whole number",
      },
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "draft",
    },

    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ status: 1, startDate: 1 });
eventSchema.index({ category: 1, startDate: 1 });

module.exports = mongoose.model("Event", eventSchema);
