"use client";

import { IProduct } from "@SharedTypes";
import { ProductCard } from "@/entities/products";

import { ComponentProps } from "react";
import clsx from "clsx";
import Link from "next/link";

import { useSWRGeneral } from "@/shared/hooks/swr/useSWRGeneral";
import { FadeLoader } from "react-spinners";

import s from "./ProductCardList.module.css";

type ProductCardListProps = ComponentProps<"div">;
export const ProductList = (props: ProductCardListProps) => {
	const { className = "", ...otherProps } = props;
	const { data: products, isLoading } = useSWRGeneral<IProduct[]>("/products");

	if (isLoading) {
		return (
			<div className={s.loader}>
				<FadeLoader color="#ffffff" />
			</div>
		);
	}

	if (!products) {
		return <h3>К сожалению мы не нашли товаров по вашему запросу</h3>;
	}

	return (
		<div className={s.productsWrapper}>
			<h1>Список товаров ({products.length})</h1>
			<div></div>
			<div className={clsx(s.products, className)} {...otherProps}>
				{products.map((product) => {
					return (
						<Link key={product.id} href={`/product-list/${product.id}`}>
							<ProductCard product={product} key={product.id} />
						</Link>
					);
				})}
			</div>
		</div>
	);
};
