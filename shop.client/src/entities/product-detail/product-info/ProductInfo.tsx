"use client";
import { useSWRGeneral } from "@/shared/hooks/swr/useSWRGeneral";
import { IProduct } from "@SharedTypes";
import { ComponentProps } from "react";
import { notFound } from "next/navigation";
import { ProductImages, SimilarProducts } from "..";

type ProductInfoProps = {
	productId: string;
} & ComponentProps<"div">;

export const ProductInfo = (props: ProductInfoProps) => {
	const { productId, ...otherProps } = props;

	const { data: product, isLoading: isProductLoading } =
		useSWRGeneral<IProduct>(`/products/${productId}`);

	if (isProductLoading) {
		return "Loading...";
	}

	if (!product) {
		notFound();
	}

	return (
		<>
			<div {...otherProps}>
				<h1>{product?.title}</h1>

				{product?.thumbnail?.url}
				<ProductImages images={product?.images} />
				{product?.description}
				{product?.price}
				<SimilarProducts products={product.similar} />
			</div>
		</>
	);
};
