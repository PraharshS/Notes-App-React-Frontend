import axios from "axios";

const NOTE_API_BASE_URL = "http://localhost:5000/node-api";

class NoteService {
  getNotesByUser(user) {
    return axios.post(NOTE_API_BASE_URL + "/notes-by-user", user);
  }
}
export default new NoteService();
