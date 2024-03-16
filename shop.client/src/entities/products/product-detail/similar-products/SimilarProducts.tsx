import { IProduct } from "@SharedTypes";

import { ComponentProps } from "react";
import Link from "next/link";
import { FaRubleSign } from "react-icons/fa";

import s from "./SimilarProducts.module.css";

type SimilarProductsProps = ComponentProps<"div"> & {
	products: IProduct["similar"];
};

export const SimilarProducts = (props: SimilarProductsProps) => {
	const { products, ...otherProps } = props;

	if (!products || products.length === 0) {
		return <h3>К сожалению мы не нашли похожих товаров</h3>;
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
