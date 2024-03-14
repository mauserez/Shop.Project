// @ts-nocheck
import { RowDataPacket } from "mysql2/index";

import {
	IAuthRequisites,
	IComment,
	IProduct,
	IProductFilterPayload,
	IProductImage,
} from "@Shared/types";

export type CommentCreatePayload = Omit<IComment, "id">;

export type ProductId = string;

export interface ICommentEntity extends RowDataPacket {
	comment_id: string;
	name: string;
	email: string;
	body: string;
	product_id: ProductId;
}

export interface IProductEntity extends IProduct, RowDataPacket {
	product_id: ProductId;
}

export interface IProductSearchFilter extends IProductFilterPayload {}

export type ImageCreatePayload = Omit<IProductImage, "id" | "productId">;

export type ProductCreatePayload = Omit<
	IProduct,
	"id" | "comments" | "thumbnail" | "images"
> & { images: ImageCreatePayload[] };

export interface IProductImageEntity extends RowDataPacket {
	image_id: string;
	url: string;
	product_id: ProductId;
	main: number;
}

export interface ProductAddImagesPayload {
	productId: ProductId;
	images: ImageCreatePayload[];
}

export type ImagesRemovePayload = string[];

export interface IUserRequisitesEntity extends IAuthRequisites, RowDataPacket {
	id: number;
}

export interface ISimilarProductEntity extends RowDataPacket {
	productId: string;
	title: string;
	description: string;
	price: number;
}

export type SimilarProductPayload = {
	productId: ProductId;
	similarProductId: string;
}[];

export type SimilarLinkProductRemovePayload = {
	productId: ProductId;
	similarProductId: string;
}[];

export type SimilarProductDeletePayload = ProductId[];

export interface IOtherProductEntity extends RowDataPacket {
	productId: string;
	title: string;
	description: string;
	price: number;
}
