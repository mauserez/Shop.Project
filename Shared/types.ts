import { IOtherProductEntity, ISimilarProductEntity } from "../Shop.API/types";

export interface IComment {
	id: string;
	name: string;
	email: string;
	body: string;
	productId: string;
}

export interface IProduct {
	id: string;
	title: string;
	description: string;
	price: number;
	thumbnail?: IProductImage;
	comments?: IComment[];
	images?: IProductImage[];
	similar?: ISimilarProductEntity[];
	otherProducts?: IOtherProductEntity[];
}

export interface IProductImage {
	id: string;
	productId: string;
	main: boolean;
	url: string;
}

export interface IProductFilterPayload {
	title?: string;
	description?: string;
	priceFrom?: number;
	priceTo?: number;
}

export interface IAuthRequisites {
	username: string;
	password: string;
}

export interface SimilarProductType {
	id: string;
	title: string;
	description: string;
	price: number;
}
