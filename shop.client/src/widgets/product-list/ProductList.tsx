"use client";
import { ComponentProps, useState } from "react";

import { IProduct } from "@SharedTypes";
import { ProductCard } from "@/entities/products";
import {
	ProductListFilters,
	SearchPayloadType,
} from "./filters/ProductListFilters";

import clsx from "clsx";
import Link from "next/link";

import { useSWRGeneral } from "@/shared/hooks/swr/useSWRGeneral";
import { FadeLoader } from "react-spinners";

import s from "./ProductList.module.css";
import { isObjectFieldsEmpty } from "@/shared/helpers/object";

type ProductCardListProps = ComponentProps<"div">;

export const ProductList = (props: ProductCardListProps) => {
	const initFilters = {
		title: "",
		priceFrom: "",
		priceTo: "",
	} satisfies SearchPayloadType;

	const [filters, setFilters] = useState<SearchPayloadType>(initFilters);
	const [tempFilters, setTempFilters] =
		useState<SearchPayloadType>(initFilters);

	const serviceMethod = isObjectFieldsEmpty(filters) ? "" : "/search";

	const { className = "", ...otherProps } = props;
	const { data: products, isLoading } = useSWRGeneral<IProduct[]>(
		`/products${serviceMethod}`,
		{
			params: filters,
		}
	);

	if (isLoading) {
		return (
			<div className={s.loader}>
				<FadeLoader color="#ffffff" />
			</div>
		);
	}

	return (
		<div className={s.productsWrapper}>
			<h1>Список товаров ({products?.length ?? 0})</h1>

			<ProductListFilters
				initFilters={initFilters}
				filters={filters}
				tempFilters={tempFilters}
				setFilters={setFilters}
				setTempFilters={setTempFilters}
			/>

			{products?.length ? (
				<div className={clsx(s.products, className)} {...otherProps}>
					{products.map((product) => {
						return (
							<Link key={product.id} href={`/product-list/${product.id}`}>
								<ProductCard product={product} key={product.id} />
							</Link>
						);
					})}
				</div>
			) : (
				<h3>К сожалению мы не нашли товаров по вашему запросу</h3>
			)}
		</div>
	);
};
