import { IProduct } from "@SharedTypes";
import { Product } from "../product/Product";
import { ComponentProps } from "react";
import clsx from "clsx";
import Link from "next/link";
import { getData } from "@/shared/helpers/get";

import s from "./ProductList.module.css";

type ProductListProps = ComponentProps<"div">;
export const ProductList = async (props: ProductListProps) => {
	const { className = "", ...otherProps } = props;
	const allProducts = (await getData<IProduct[]>("/products")) || [];

	return (
		<>
			<h1>Список товаров ({allProducts.length})</h1>
			<div className={clsx(s.products, className)} {...otherProps}>
				{allProducts.map((product) => {
					return (
						<Link key={product.id} href={`/product-list/${product.id}`}>
							<Product product={product} key={product.id} />
						</Link>
					);
				})}
			</div>
		</>
	);
};
