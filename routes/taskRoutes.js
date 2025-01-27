const express = require("express");
const { createTask, getTasks,getTasksByUserId } = require("../controllers/taskController");

const router = express.Router();


/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve a list of all tasks from the database.
 *     responses:
 *       200:
 *         description: List of tasks
 *       500:
 *         description: Internal server error
 */
router.get("/", getTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Add a new task to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/", createTask);

/**
 * @swagger
 * /tasks/{userId}:
 *   get:
 *     summary: Get all tasks for a specific user
 *     description: Retrieve all tasks for a user based on their userId.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The userId to get tasks for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks for the user
 *       404:
 *         description: No tasks found for the user
 *       500:
 *         description: Internal server error
 */
router.get("/:userId", getTasksByUserId);

module.exports = router;
