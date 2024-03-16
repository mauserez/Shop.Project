import axios from "axios";
import { API_URL } from "../api-const";

export const backendApi = axios.create({
	baseURL: API_URL,
});

backendApi.interceptors.request.use(async (request) => {
	return request;
});
