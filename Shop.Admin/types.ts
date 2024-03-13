import { ProductId } from "../Shop.API/types";

declare module "express-session" {
	export interface SessionData {
		username?: string;
	}
}

export interface IProductEditData {
	title: string;
	description: string;
	price: string;
	mainImage: string;
	newImages?: string;
	commentsToRemove: string | string[];
	imagesToRemove: string | string[];
	similarToAdd: ProductId | ProductId[];
	similarToRemove: ProductId | ProductId[];
}
