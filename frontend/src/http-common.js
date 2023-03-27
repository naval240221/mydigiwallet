import axios from "axios";

export default axios.create({
  baseURL: "https://digiwallet.onrender.com",
  headers: {
    "Content-type": "application/json"
  }
});