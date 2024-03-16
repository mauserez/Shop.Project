import { ComponentProps } from "react";
import { IProduct } from "@SharedTypes";

import Image from "next/image";
import { BiSolidChat } from "react-icons/bi";
import { FaRubleSign } from "react-icons/fa";

import clsx from "clsx";
import s from "./ProductCard.module.css";

type ProductCardProps = { product: IProduct } & ComponentProps<"div">;
export const ProductCard = (props: ProductCardProps) => {
	const { product, className = "", ...otherProps } = props;
	const imgUrl = product?.thumbnail?.url;
	const imgPLaceholder = "/img/product-placeholder.png";

	const src = imgUrl || imgPLaceholder;

	return (
		<div className={clsx(s.product, className)} {...otherProps}>
			<div className={s.image}>
				<Image
					width={330}
					height={330}
					priority={true}
					src={src}
					alt="Обложка продукта"
				/>
			</div>
			<div className={s.details}>
				<div>{product.title}</div>
				<div className={s.subDetails}>
					<div className={s.commentCount}>
						{product.comments?.length || 0}
						<BiSolidChat />
					</div>
					<div className={s.price}>
						{product.price}{" "}
						<span className={s.priceIcon}>
							<FaRubleSign />
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
