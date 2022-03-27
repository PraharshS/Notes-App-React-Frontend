import axios from "axios";

// const NOTE_API_BASE_URL = "http://localhost:5000/node-api";
const NOTE_API_BASE_URL = "http://localhost:8000/go-api";
class NoteService {
  getTasksByUser(user) {
    return axios.post(NOTE_API_BASE_URL + "/tasksByUser", user);
  }
  addTask(taskObj) {
    return axios.post(NOTE_API_BASE_URL + "/task", taskObj);
  }
  updateTask(taskId, taskObj) {
    return axios.put(NOTE_API_BASE_URL + "/update-task/" + taskId, taskObj);
  }
  deleteTask(taskId) {
    return axios.delete(NOTE_API_BASE_URL + "/task/" + taskId);
  }
  toggleTaskDone(taskId) {
    return axios.put(NOTE_API_BASE_URL + "/task/" + taskId);
  }
}
export default new NoteService();
