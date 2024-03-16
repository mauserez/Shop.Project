import { backendApi } from "../axios/backend";

import { AxiosRequestConfig } from "axios";

export const getData = async <T>(
	endpoint: string,
	config: AxiosRequestConfig = {},
	anotherApi: string | null = null
) => {
	if (anotherApi) {
		backendApi.defaults.baseURL = "";
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
	anotherApi: string | null = null
) => {
	if (anotherApi) {
		backendApi.defaults.baseURL = "";
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
