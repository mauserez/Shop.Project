import axios from "axios";
import { IProduct, IProductFilterPayload } from "@Shared/types";
import { IProductEditData } from "../types";
import { API_HOST } from "./const";
import {
	SimilarProductPayload,
	SimilarLinkProductRemovePayload,
	ProductId,
} from "../../Shop.API/types";

export async function getProducts(): Promise<IProduct[]> {
	const { data } = await axios.get<IProduct[]>(`${API_HOST}/products`);
	return data || [];
}

export async function searchProducts(
	filter: IProductFilterPayload
): Promise<IProduct[]> {
	const { data } = await axios.get<IProduct[]>(`${API_HOST}/products/search`, {
		params: filter,
	});
	return data || [];
}

export async function getProduct(id: string): Promise<IProduct | null> {
	try {
		const { data } = await axios.get<IProduct>(`${API_HOST}/products/${id}`);
		return data;
	} catch (e) {
		return null;
	}
}

export async function removeProduct(id: string): Promise<void> {
	await axios.delete(`${API_HOST}/products/${id}`);
}

function splitNewImages(str = ""): string[] {
	return str
		.split(/\r\n|,/g)
		.map((url) => url.trim())
		.filter((url) => url);
}

function compileIdsToRemove(data: string | string[]): string[] {
	if (typeof data === "string") return [data];
	return data;
}

export async function updateProduct(
	productId: string,
	formData: IProductEditData
): Promise<void> {
	try {
		const { data: currentProduct } = await axios.get<IProduct>(
			`${API_HOST}/products/${productId}`
		);

		//add similar
		if (formData.similarToAdd) {
			let similarToAdd = [];

			if (Array.isArray(formData.similarToAdd)) {
				similarToAdd = formData.similarToAdd;
			} else {
				similarToAdd = [formData.similarToAdd];
			}

			const addSimilar: SimilarProductPayload = [];

			similarToAdd.map((similarProductId) => {
				addSimilar.push({
					productId: productId,
					similarProductId: similarProductId,
				});
			});

			await axios.post(`${API_HOST}/products/add-similar`, addSimilar);
		}

		//remove similar
		if (formData.similarToRemove) {
			let similarToRemove = [];

			if (Array.isArray(formData.similarToRemove)) {
				similarToRemove = formData.similarToRemove;
			} else {
				similarToRemove = [formData.similarToRemove];
			}

			const removeSimilar: SimilarLinkProductRemovePayload = [];

			similarToRemove.map((similarProductId) => {
				removeSimilar.push({
					productId: productId,
					similarProductId: similarProductId,
				});
			});

			await axios.post(`${API_HOST}/products/remove-similar`, removeSimilar);
		}

		//remove comments
		if (formData.commentsToRemove) {
			const commentsIdsToRemove = compileIdsToRemove(formData.commentsToRemove);

			const getDeleteCommentActions = () =>
				commentsIdsToRemove.map((commentId) => {
					return axios.delete(`${API_HOST}/comments/${commentId}`);
				});

			await Promise.all(getDeleteCommentActions());
		}

		//remove images
		if (formData.imagesToRemove) {
			const imagesIdsToRemove = compileIdsToRemove(formData.imagesToRemove);
			await axios.post(`${API_HOST}/products/remove-images`, imagesIdsToRemove);
		}

		//add images
		if (formData.newImages) {
			const urls = splitNewImages(formData.newImages);

			const images = urls.map((url) => ({ url, main: false }));

			if (!currentProduct.thumbnail) {
				images[0].main = true;
			}

			await axios.post(`${API_HOST}/products/add-images`, {
				productId,
				images,
			});
		}

		//set main image
		if (
			formData.mainImage &&
			formData.mainImage !== currentProduct.thumbnail?.id
		) {
			await axios.post(`${API_HOST}/products/update-thumbnail/${productId}`, {
				newThumbnailId: formData.mainImage,
			});
		}

		//update product main fields
		await axios.patch(`${API_HOST}/products/${productId}`, {
			title: formData.title,
			description: formData.description,
			price: Number(formData.price),
		});
	} catch (e) {
		console.log(e);
	}
}

export async function addProduct(
	formData: IProductEditData
): Promise<ProductId> {
	try {
		//save new product main fields

		let images = [];
		//add images
		if (formData.newImages) {
			const urls = splitNewImages(formData.newImages);
			images = urls.map((url) => ({ url, main: false }));
		}

		const response = await axios.post<ProductId>(`${API_HOST}/products`, {
			title: formData.title,
			description: formData.description,
			price: Number(formData.price),
			images: images,
		});

		return response.data;
	} catch (e) {
		console.log(e);
	}
}
