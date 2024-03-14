import { ComponentProps } from "react";
import { IProduct } from "@SharedTypes";
import Link from "next/link";
import { FaRubleSign } from "react-icons/fa";

import s from "./SimilarProducts.module.css";

type SimilarProductsProps = ComponentProps<"div"> & {
	products: IProduct["similar"];
};

export const SimilarProducts = (props: SimilarProductsProps) => {
	const { products, ...otherProps } = props;

	if (!products) {
		return null;
	}

	return (
		<div className={s.container} {...otherProps}>
			{products.map((product) => (
				<Link
					key={product.productId}
					href={`/product-list/${product.productId}`}
				>
					<div key={product.productId}>
						<div className={s.title}>{product.title}</div>
						<div className={s.price}>
							{product.price}
							<span className={s.priceIcon}>
								<FaRubleSign />
							</span>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};
