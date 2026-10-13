const Project = require("../models/Project");

const Task = require("../models/Task");
const createProject = async (req, res, next) => {
  try {
    const { name, description = "" } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required.",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description.trim(),
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Project name cannot be empty.",
        });
      }
      updates.name = name.trim();
    }
    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          success: false,
          message: "Project description must be a string.",
        });
      }
      updates.description = description.trim();
    }
    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "Provide atleast one field to update.",
      });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true, runValidators: true },
    );
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    await Task.deleteMany({ project: project._id, owner: req.user._id });
    await project.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Project and its tasks deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};
