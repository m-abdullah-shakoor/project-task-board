const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.use(protect);

router.route("/projects/:projectId/tasks").post(createTask).get(getTasks);
router.route("/tasks/:id").put(updateTask).delete(deleteTask);
module.exports = router;
