import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const backendApi = axios.create({
	baseURL: API_URL,
});

backendApi.interceptors.request.use(async (request) => {
	return request;
});
