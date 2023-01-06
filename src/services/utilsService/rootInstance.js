import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network-production.up.railway.app/api",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
    },
});

export default instance;
