
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createOrganizer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = "organizer.test@example.com";
    const password = "OrganizerPass123!";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role === "organizer") {
        console.log("Organizer test account already exists.");
      } else {
        console.log(
          "This email already belongs to a non-organizer account."
        );
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: "Test Organizer",
      email,
      password: hashedPassword,
      role: "organizer",
    });

    console.log("Organizer test account created successfully.");
    console.log("Email:", email);
    console.log("Password:", password);
  } catch (error) {
    console.error("Failed to create organizer:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createOrganizer();
