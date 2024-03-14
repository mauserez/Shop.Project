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

import "./product-images.css";

import { FreeMode, Navigation, Thumbs } from "swiper/modules";

export default function App() {}

type ProductImagesProps = ComponentProps<"div"> & {
	images: IProduct["images"];
};

export const ProductImages = (props: ProductImagesProps) => {
	const { images, ...otherProps } = props;
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

	if (!images) {
		return null;
	}

	return (
		<>
			<Swiper
				style={
					{
						//"--swiper-navigation-color": "#fff",
						//"--swiper-pagination-color": "#fff",
					}
				}
				spaceBetween={10}
				navigation={true}
				thumbs={{ swiper: thumbsSwiper }}
				modules={[FreeMode, Navigation, Thumbs]}
				className="mySwiper2"
			>
				{images.map((image) => (
					<SwiperSlide key={image.id}>
						<img src={image.url} />
					</SwiperSlide>
				))}
			</Swiper>

			<Swiper
				onSwiper={setThumbsSwiper}
				spaceBetween={10}
				slidesPerView={4}
				freeMode={true}
				watchSlidesProgress={true}
				modules={[FreeMode, Navigation, Thumbs]}
				className="mySwiper"
			>
				{images.map((image) => (
					<SwiperSlide key={image.id}>
						<img src={image.url} />
					</SwiperSlide>
				))}
				{/*
					<SwiperSlide key={image.id}>
						<Image
							sizes="100%"
							fill={true}
							alt="Фото продукта"
							src={image.url}
						/>
					</SwiperSlide> */}
			</Swiper>
		</>
	);
};
