import { ComponentProps } from "react";
import { IProduct } from "@SharedTypes";

type SimilarProductsProps = ComponentProps<"div"> & {
	products: IProduct["similar"];
};

export const SimilarProducts = (props: SimilarProductsProps) => {
	const { products, ...otherProps } = props;

	if (!products) {
		return null;
	}

	return (
		<div {...otherProps}>
			{products.map((product) => {
				return product.title;
			})}
		</div>
	);
};
