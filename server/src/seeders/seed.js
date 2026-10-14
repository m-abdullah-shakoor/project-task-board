require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

const DEMO_EMAIL = "demo@taskboard.dev";
const DEMO_PASSWORD = "password123";

// Due dates are relative to today so the demo always has overdue,
// due-soon and future tasks.
const daysFromNow = (days) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
};

const sampleProjects = [
  {
    name: "Website Redesign",
    description: "Refresh the marketing site with the new brand.",
    isActive: true,
    tasks: [
      { title: "Collect brand assets", status: "completed", priority: "low", dueDate: daysFromNow(-5) },
      { title: "Design homepage mockup", status: "in-progress", priority: "high", dueDate: daysFromNow(2) },
      { title: "Build responsive navbar", status: "todo", priority: "medium", dueDate: daysFromNow(7) },
      { title: "Write launch announcement", status: "todo", priority: "low", dueDate: null },
    ],
  },
  {
    name: "Mobile App MVP",
    description: "First release of the companion mobile app.",
    isActive: true,
    tasks: [
      { title: "Set up push notifications", status: "todo", priority: "high", dueDate: daysFromNow(-1) },
      { title: "Implement login screen", status: "in-progress", priority: "medium", dueDate: daysFromNow(1) },
      { title: "App store listing", status: "todo", priority: "medium", dueDate: daysFromNow(14) },
    ],
  },
  {
    name: "Q1 Planning (Archived)",
    description: "Planning notes from last quarter.",
    isActive: false,
    tasks: [
      { title: "Finalize Q1 roadmap", status: "completed", priority: "high", dueDate: daysFromNow(-30) },
    ],
  },
];

// Resets the demo user's data so the seeder can be run any number of times.
const seed = async () => {
  let user = await User.findOne({ email: DEMO_EMAIL });

  if (!user) {
    user = await User.create({
      name: "Demo User",
      email: DEMO_EMAIL,
      password: await bcrypt.hash(DEMO_PASSWORD, 12),
    });
  }

  await Task.deleteMany({ owner: user._id });
  await Project.deleteMany({ owner: user._id });

  let taskCount = 0;

  for (const { tasks, ...projectData } of sampleProjects) {
    const project = await Project.create({ ...projectData, owner: user._id });

    await Task.insertMany(
      tasks.map((task) => ({ ...task, project: project._id, owner: user._id })),
    );
    taskCount += tasks.length;
  }

  return { user, projectCount: sampleProjects.length, taskCount };
};

const run = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not configured");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const { projectCount, taskCount } = await seed();

    console.log(`Seeded ${projectCount} projects and ${taskCount} tasks.`);
    console.log(`Log in with ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  run();
}

module.exports = { seed, DEMO_EMAIL, DEMO_PASSWORD };
