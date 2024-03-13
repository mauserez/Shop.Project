import { headers } from "next/headers";

import queryString from "query-string";

export const getUrl = () => {
	const heads = headers();
	const url = heads.get("x-url") ?? "";

	return url;
};

export const getSearchString = () => {
	const url = getUrl();
	const parsed = queryString.parseUrl(url);

	return queryString.stringify(parsed.query);
};

export const getSearchParams = () => {
	const url = getUrl();
	const parsed = queryString.parseUrl(url);
	const queryParams = parsed.query;

	return queryParams;
};
