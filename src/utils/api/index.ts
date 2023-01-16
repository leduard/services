import axios from "axios";

const baseURL =
    process.env.NODE_ENV === "production"
        ? "https://services.eduaard.com"
        : "http://localhost:3000";

const api = axios.create({
    baseURL: `${baseURL}/api`,
});

export default api;
