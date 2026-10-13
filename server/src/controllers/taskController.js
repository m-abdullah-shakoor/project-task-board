const mongoose = require("mongoose");
const Project = require("../models/Project");
const Task = require("../models/Task");

const validStatuses = ["todo", "in-progress", "completed"];
const validPriorities = ["low", "medium", "high"];

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const findOwnedProject = async (projectId, userId) =>
  Project.findOne({ _id: projectId, owner: userId });

const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description = "", status, priority } = req.body;

    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const project = await findOwnedProject(projectId, req.user._id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required.",
      });
    }

    if (status !== undefined && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}.`,
      });
    }

    if (priority !== undefined && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority. Valid priorities are: ${validPriorities.join(", ")}.`,
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      status: status || "todo",
      priority: priority || "medium",
      project: project._id,
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }
    const project = await findOwnedProject(projectId, req.user._id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const filter = { project: project._id, owner: req.user._id };
    if (req.query.status !== undefined) {
      if (!validStatuses.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status filter. Valid statuses are: ${validStatuses.join(", ")}.`,
        });
      }
      filter.status = req.query.status;
    }
    if (req.query.priority !== undefined) {
      if (!validPriorities.includes(req.query.priority)) {
        return res.status(400).json({
          success: false,
          message: `Invalid priority filter. Valid priorities are: ${validPriorities.join(", ")}.`,
        });
      }
      filter.priority = req.query.priority;
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    const updates = {};
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Task title cannot be empty.",
        });
      }
      updates.title = title.trim();
    }
    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          success: false,
          message: "Task description must be a string.",
        });
      }
      updates.description = description;
    }
    if (status !== undefined) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid task status. Valid statuses are: ${validStatuses.join(", ")}.`,
        });
      }
      updates.status = status;
    }
    if (priority !== undefined) {
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: `Invalid task priority. Valid priorities are: ${validPriorities.join(", ")}.`,
        });
      }
      updates.priority = priority;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid field for update.",
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      updates,
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};


const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};