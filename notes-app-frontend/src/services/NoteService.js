import axios from "axios";

// const NOTE_API_BASE_URL = "http://localhost:5000/node-api";
const NOTE_API_BASE_URL = "http://localhost:8000/go-api";
class NoteService {
  getNotesByUser(user) {
    return axios.post(NOTE_API_BASE_URL + "/notesByUser", user);
  }
  addNote(noteObj) {
    return axios.post(NOTE_API_BASE_URL + "/note", noteObj);
  }
  updateNote(noteId, noteObj) {
    return axios.put(NOTE_API_BASE_URL + "/note/" + noteId, noteObj);
  }
  deleteNote(noteId) {
    return axios.delete(NOTE_API_BASE_URL + "/note/" + noteId);
  }
  toggleTaskDone(noteId) {
    return axios.put(NOTE_API_BASE_URL + "/note/" + noteId);
  }
}
export default new NoteService();
