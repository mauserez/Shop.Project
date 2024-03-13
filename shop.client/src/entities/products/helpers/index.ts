import { IProduct } from "@SharedTypes";

export const calcCountAndSum = (products: IProduct[] = []) => {
	let count = 0;
	let priceSum = 0;

	products.map((product) => {
		count++;
		priceSum += product.price;
	});

	return { count, priceSum };
};
