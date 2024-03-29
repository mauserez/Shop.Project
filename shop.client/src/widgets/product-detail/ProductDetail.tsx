"use client";
import { IProduct } from "@SharedTypes";
import { useSWRGeneral } from "@/shared/hooks/swr/useSWRGeneral";
import { ComponentProps } from "react";

import {
	CommentForm,
	Comments,
	ProductImages,
	SimilarProducts,
} from "@/entities/products/product-detail";

import { notFound } from "next/navigation";
import { FaRubleSign } from "react-icons/fa";

import clsx from "clsx";
import s from "./ProductDetail.module.css";

type ProductInfoProps = {
	productId: string;
} & ComponentProps<"div">;

export const ProductDetail = (props: ProductInfoProps) => {
	const { productId, ...otherProps } = props;

	const {
		data: product,
		isLoading: isProductLoading,
		mutate,
	} = useSWRGeneral<IProduct>(`/products/${productId}`);

	if (isProductLoading) {
		return "Loading...";
	}

	if (!product) {
		notFound();
	}

	return (
		<>
			<div
				className={clsx({
					[s.wrap]: true,
					"fade-in": !isProductLoading,
				})}
				{...otherProps}
			>
				<h1>{product?.title}</h1>
				<div className={s.info}>
					<div className={s.slider}>
						<ProductImages images={product?.images} />
					</div>
					<div className={s.subInfo}>
						<div>
							<h3 className={s.label}>Описание</h3>
							<div>{product?.description}</div>
						</div>
						<div className={s.price}>
							{product?.price}
							<span className={s.priceIcon}>
								<FaRubleSign />
							</span>
						</div>
					</div>
				</div>

				<div className={s.similar}>
					<h2>Похожие товары</h2>
					<SimilarProducts products={product.similar || []} />
				</div>
				<div className={s.comments}>
					<h2>Комментарии</h2>
					<div className={s.commentsContainer}>
						<CommentForm refreshComments={mutate} productId={productId} />
						<Comments comments={product.comments || []} />
					</div>
				</div>
			</div>
		</>
	);
};
