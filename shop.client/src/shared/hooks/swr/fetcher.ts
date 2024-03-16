import { backendApi } from "@/shared/axios/backend";
import queryString from "query-string";

type GetDataOptionsType = [string, string | {}, string];

export const fetcher = async <T>(options: GetDataOptionsType) => {
	const [endpoint, params, apiUrl] = options;

	const prms = typeof params === "string" ? queryString.parse(params) : params;

	if (apiUrl) {
		backendApi.defaults.baseURL = apiUrl;
	}

	try {
		const result = await backendApi.get<T>(endpoint, { params: prms });
		const data = result.data;

		return data;
	} catch (error) {
		return null;
	}

	/* return backendApi
        .get<T>(endpoint, { params: prms })
        .then((res) => {
            return res.data;
        })

        .catch((e) => {
            console.log(e);
            return null;
        }); */
};
