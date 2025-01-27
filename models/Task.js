class Task {
    constructor(id, title, description, userId, status = "pending") {
      this.id = id;
      this.title = title;
      this.description = description;
      this.userId = userId; 
      this.status = status; // "pending", "in-progress", "completed"
    }
  }
  
  module.exports = Task;