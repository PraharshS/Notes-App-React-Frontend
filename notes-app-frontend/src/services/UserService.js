import axios from "axios";

const STUDENT_API_BASE_URL = "http://localhost:5000/node-api/v1";

class UserService {
  createUser() {
    return axios.post(STUDENT_API_BASE_URL + "/add");
  }
}
export default new UserService();
