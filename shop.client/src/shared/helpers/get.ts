import { backendApi } from "../axios/backend";

import { AxiosRequestConfig } from "axios";

export const getData = async <T>(
	endpoint: string,
	config: AxiosRequestConfig = {},
	apiUrl: string | null = null
) => {
	if (apiUrl) {
		backendApi.defaults.baseURL = apiUrl;
	}

	try {
		const result = await backendApi.get<T>(endpoint, config);
		const data = result.data;

		return data;
	} catch (error) {
		return null;
	}
};

export const useData = <T>(
	endpoint: string,
	config: AxiosRequestConfig = {},
	apiUrl: string | null = null
) => {
	if (apiUrl) {
		backendApi.defaults.baseURL = apiUrl;
	}

	return backendApi
		.get<T>(endpoint, config)
		.then((res) => {
			return res.data as T;
		})
		.catch((e) => {
			console.log(e);
			return null;
		});
};
