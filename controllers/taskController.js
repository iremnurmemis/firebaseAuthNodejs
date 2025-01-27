const Task = require("../models/Task");
const {firestore} = require("../firebase");
const tasksRef = firestore.collection("tasks");

const getTasks = async (req, res) => {
  try {
    const snapshot = await tasksRef.get();
    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error getting tasks", error });
  }
};

const createTask = async (req, res) => {
    try {
      const { title, description, userId } = req.body;
  
      if (!title || !description || !userId) {
        return res.status(400).json({ message: "Title, description and userId are required" });
      }
  
      const taskRef = firestore.collection("tasks").doc();
      await taskRef.set({
        title,
        description,
        userId,
        createdAt: new Date(),
      });
  
      return res.status(201).json({ message: "Task created successfully", taskId: taskRef.id });
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(500).json({ message: "Error creating task", error: error.message });
    }
  };

  const getTasksByUserId = async (req, res) => {
    try {
      const userId = req.params.userId; 
  
     
      const tasksSnapshot = await tasksRef.where("userId", "==", userId).get();
  
      if (tasksSnapshot.empty) {
        return res.status(404).json({ message: "No tasks found for this user" });
      }
  
   
      const tasks = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      return res.status(200).json(tasks); 
    } catch (error) {
      console.error("Error getting tasks:", error);
      return res.status(500).json({ message: "Error getting tasks", error });
    }
  };
  

  module.exports = { createTask, getTasks,getTasksByUserId };