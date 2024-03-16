"use client";
import { ComponentProps } from "react";
import { IProduct } from "@SharedTypes";
import Image from "next/image";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper/types";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import s from "./ProductImages.module.css";

import { FreeMode, Navigation, Thumbs } from "swiper/modules";

export default function App() {}

type ProductImagesProps = ComponentProps<"div"> & {
	images: IProduct["images"];
};

export const ProductImages = (props: ProductImagesProps) => {
	let { images } = props;
	const imagesExists = !!images;
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

	if (!images) {
		images = [
			{
				id: "placeholder",
				productId: "placeholder",
				main: false,
				url: "/img/product-placeholder.png",
			},
		];
	}

	return (
		<>
			<Swiper
				spaceBetween={16}
				navigation={true}
				thumbs={{ swiper: thumbsSwiper }}
				modules={[FreeMode, Navigation, Thumbs]}
				className={s.mainSwiper}
			>
				{images.map((image) => (
					<SwiperSlide key={image.id}>
						<Image
							height={300}
							width={300}
							alt="Фото товара"
							className={s.swiperImg}
							src={image.url}
						/>
					</SwiperSlide>
				))}
			</Swiper>
			{imagesExists ? (
				<Swiper
					className={s.subSwiper}
					onSwiper={setThumbsSwiper}
					spaceBetween={16}
					slidesPerView={4}
					freeMode={true}
					watchSlidesProgress={true}
					modules={[FreeMode, Navigation, Thumbs]}
				>
					{images.map((image) => (
						<SwiperSlide key={image.id}>
							<Image
								width={100}
								height={100}
								alt="Фото товара"
								className={s.swiperImg}
								src={image.url}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			) : null}
		</>
	);
};
