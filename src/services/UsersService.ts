import axios from "axios";

const ADD_USER_API_BASE_URL = "http://localhost:8080/api/register";

class UserService {
  addUser(saveData: {}) {
    return axios.post(ADD_USER_API_BASE_URL, saveData);
  }
}

export default new UserService();
