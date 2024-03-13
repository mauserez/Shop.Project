import { useSearchParams as nextUseSearchParams } from "next/navigation";

import queryString from "query-string";

export const useSearchString = () => {
	return nextUseSearchParams().toString();
};

export const useSearchParams = () => {
	const paramsString = nextUseSearchParams().toString();

	return queryString.parse(paramsString);
};
