import useSWR, { SWRConfiguration } from "swr";

import { fetcher } from "./fetcher";

export const useSWRGeneral = <T>(
	endpoint: string,

	paramsString?: string | null,

	refresh: number = 0,

	swrConfig?: SWRConfiguration,

	apiUrl?: string | null
) => {
	const config = { refreshInterval: refresh, ...swrConfig };

	return useSWR([endpoint, paramsString, apiUrl], fetcher<T>, config);
};
