"use client";

import { AxiosRequestConfig } from "axios";
import useSWR, { SWRConfiguration } from "swr";

import { getFetcher } from "./fetcher";

export const useSWRGeneral = <T>(
	endpoint: string,
	axiosConfig: AxiosRequestConfig = {},
	refresh: number = 0,
	swrConfig?: SWRConfiguration,
	apiUrl?: string | null
) => {
	const revalidateOnlyOnRefresh = !!!refresh;
	const refreshMs = refresh * 1000;
	const config = {
		refreshInterval: refreshMs,
		revalidateOnFocus: revalidateOnlyOnRefresh,
		...swrConfig,
	} as SWRConfiguration;

	return useSWR([endpoint, axiosConfig, apiUrl], getFetcher<T>, config);
};
