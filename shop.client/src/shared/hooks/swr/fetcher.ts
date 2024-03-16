import { backendApi } from "@/shared/axios/backend";
import { AxiosRequestConfig } from "axios";

type GetDataOptionsType = [string, AxiosRequestConfig, string];

export const getFetcher = async <T>(options: GetDataOptionsType) => {
	const [endpoint, axiosConfig, apiUrl] = options;

	if (apiUrl) {
		backendApi.defaults.baseURL = apiUrl;
	}

	/* try {
		const result = await backendApi.get<T>(endpoint, axiosConfig);
		const data = result.data;

		return data;
	} catch (error) {
		return null;
	} */

	return backendApi
		.get<T>(endpoint, axiosConfig)
		.then((res) => {
			return res.data;
		})

		.catch((e) => {
			console.log(e);
			return null;
		});
};
