export const isObjectFieldsEmpty = (object: {}) => {
	return Object.values(object).every(
		(x) => x === null || x === "" || x === undefined
	);
};
