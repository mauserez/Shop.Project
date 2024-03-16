"use client";
import { ComponentProps, useState } from "react";

import { IProduct } from "@SharedTypes";
import { ProductCard } from "@/entities/products";

import clsx from "clsx";
import Link from "next/link";

import { useSWRGeneral } from "@/shared/hooks/swr/useSWRGeneral";
import { FadeLoader } from "react-spinners";

import s from "./ProductList.module.css";
import { Button } from "@/shared/ui/button/Button";
import { Input } from "@/shared/ui";
import { isObjectFieldsEmpty } from "@/shared/helpers/object";
import { FormItemChangeEvent } from "@/shared/ui/types";

type SearchPayloadType = {
	title: string;
	priceFrom: number | undefined;
	priceTo: number | undefined;
};

type ProductCardListProps = ComponentProps<"div">;

export const ProductList = (props: ProductCardListProps) => {
	const initFilters = {
		title: "",
		priceFrom: undefined,
		priceTo: undefined,
	} satisfies SearchPayloadType;

	const [filters, setFilters] = useState(initFilters);
	const [tempFilters, setTempFilters] = useState(initFilters);

	const handleFormItem = (e: FormItemChangeEvent) => {
		const formItemValues = { [e.target.name]: e.target.value };
		setTempFilters({ ...filters, ...formItemValues });
	};
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

			<form className={s.productFilter}>
				<div className={s.formItem}>
					<label>Название</label>
					<Input
						onChange={handleFormItem}
						name="title"
						placeholder="Введите название"
						value={tempFilters.title}
					/>
				</div>

				<div className={s.formItem}>
					<label>Цена от</label>
					<Input
						type="number"
						width={100}
						onChange={handleFormItem}
						name="priceFrom"
						placeholder="0"
						value={tempFilters.priceFrom}
					/>
				</div>

				<div className={s.formItem}>
					<label>Цена до</label>
					<Input
						type="number"
						width={100}
						onChange={handleFormItem}
						name="priceTo"
						placeholder="0"
						value={tempFilters.priceTo}
					/>
				</div>
				<Button
					className={s.submitButton}
					onClick={(e) => {
						e.preventDefault();
						setFilters(tempFilters);
					}}
				>
					Найти
				</Button>
			</form>
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
