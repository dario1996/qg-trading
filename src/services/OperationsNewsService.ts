import axios from "axios";

const GET_OPERATION_LIST_API_BASE_URL = "http://localhost:8080/api/operations/news";
const ADD_OPERATION_API_BASE_URL = "http://localhost:8080/api/add-operation/news";
const DELETE_OPERATION_API_BASE_URL =
  "http://localhost:8080/api/delete-operation/news";
const GET_OPERATION_API_BASE_URL = "http://localhost:8080/api/operation/news";
const EDIT_OPERATION_API_BASE_URL = "http://localhost:8080/api/operation/news";

class OperationNewsService {
  getOperations() {
    return axios.get(GET_OPERATION_LIST_API_BASE_URL);
  }
  addOperation(saveData: {}) {
    return axios.post(ADD_OPERATION_API_BASE_URL, saveData);
  }
  deleteOperation(operationId: number) {
    return axios.delete(DELETE_OPERATION_API_BASE_URL + `/${operationId}`);
  }
  getOperation(operationId: number) {
    return axios.get(GET_OPERATION_API_BASE_URL + `/${operationId}`);
  }
  editOperation(saveData: {}, operationId: number) {
    return axios.put(EDIT_OPERATION_API_BASE_URL + `/${operationId}`, saveData);
  }
}

export default new OperationNewsService();
