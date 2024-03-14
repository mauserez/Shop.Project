import { ComponentProps } from "react";
import Image from "next/image";
import { IProduct } from "@SharedTypes";
import { BiComment } from "react-icons/bi";

import clsx from "clsx";
import s from "./Product.module.css";
import { FaRubleSign } from "react-icons/fa";

type ProductProps = { product: IProduct } & ComponentProps<"div">;
export const Product = (props: ProductProps) => {
	const { product, className = "", ...otherProps } = props;
	const imgUrl = product?.thumbnail?.url;
	const imgPLaceholder = "/img/product-placeholder.png";

	const src = imgUrl || imgPLaceholder;

	return (
		<div className={clsx(s.product, className)} {...otherProps}>
			<div className={s.image}>
				<Image
					style={{ objectFit: "cover" }}
					sizes="100%"
					fill={true}
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
						<BiComment />
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
