import { IProduct } from "@Shared/types";
import { Request, Response, Router } from "express";
import { connection } from "../../index";
import { v4 as uuidv4 } from "uuid";
import { OkPacket } from "mysql2";
import {
	enhanceProductsComments,
	enhanceProductsImages,
	getProductsFilterQuery,
} from "../helpers";
import {
	ICommentEntity,
	ImagesRemovePayload,
	IProductEntity,
	IProductImageEntity,
	IProductSearchFilter,
	ISimilarProductEntity,
	ProductAddImagesPayload,
	ProductCreatePayload,
	SimilarProductPayload,
} from "../../types";
import {
	mapCommentsEntity,
	mapImagesEntity,
	mapProductsEntity,
} from "../services/mapping";
import {
	DELETE_IMAGES_QUERY,
	INSERT_PRODUCT_IMAGES_QUERY,
	INSERT_PRODUCT_QUERY,
	REPLACE_PRODUCT_THUMBNAIL,
	UPDATE_PRODUCT_FIELDS,
	GET_SIMILAR_PRODUCTS_QUERY,
	INSERT_SIMILAR_PRODUCTS_QUERY,
	DELETE_SIMILAR_PRODUCTS_BY_IDS_QUERY,
	DELETE_SIMILAR_PRODUCTS_QUERY,
	OTHER_PRODUCTS_EXCLUDE_SIMILAR_QUERY,
} from "../services/queries";

import { body, param, validationResult } from "express-validator";

export const productsRouter = Router();

const throwServerError = (res: Response, e: Error) => {
	console.debug(e.message);
	res.status(500);
	res.send("Something went wrong");
};

productsRouter.get("/", async (req: Request, res: Response) => {
	try {
		const [productRows] = await connection.query<IProductEntity[]>(
			"SELECT * FROM products"
		);
		const [commentRows] = await connection.query<ICommentEntity[]>(
			"SELECT * FROM comments"
		);
		const [imageRows] = await connection.query<IProductImageEntity[]>(
			"SELECT * FROM images"
		);

		const products = mapProductsEntity(productRows);
		const withComments = enhanceProductsComments(products, commentRows);
		const withImages = enhanceProductsImages(withComments, imageRows);

		res.send(withImages);
	} catch (e) {
		throwServerError(res, e);
	}
});

productsRouter.get(
	"/search",
	async (req: Request<{}, {}, {}, IProductSearchFilter>, res: Response) => {
		try {
			const [query, values] = getProductsFilterQuery(req.query);
			const [rows] = await connection.query<IProductEntity[]>(query, values);

			if (!rows?.length) {
				res.send([]);
				return;
			}

			const [commentRows] = await connection.query<ICommentEntity[]>(
				"SELECT * FROM comments"
			);
			const [imageRows] = await connection.query<IProductImageEntity[]>(
				"SELECT * FROM images"
			);

			const products = mapProductsEntity(rows);
			const withComments = enhanceProductsComments(products, commentRows);
			const withImages = enhanceProductsImages(withComments, imageRows);

			res.send(withImages);
		} catch (e) {
			throwServerError(res, e);
		}
	}
);

productsRouter.get(
	"/:id",
	async (req: Request<{ id: string }>, res: Response) => {
		try {
			const [rows] = await connection.query<IProductEntity[]>(
				"SELECT * FROM products WHERE product_id = ?",
				[req.params.id]
			);

			if (!rows?.[0]) {
				res.status(404);
				res.send(`Product with id ${req.params.id} is not found`);
				return;
			}

			const [comments] = await connection.query<ICommentEntity[]>(
				"SELECT * FROM comments WHERE product_id = ? order by dt desc",
				[req.params.id]
			);

			const [images] = await connection.query<IProductImageEntity[]>(
				"SELECT * FROM images WHERE product_id = ? order by main desc",
				[req.params.id]
			);

			const [similar] = await connection.query<ISimilarProductEntity[]>(
				GET_SIMILAR_PRODUCTS_QUERY,
				[req.params.id, req.params.id]
			);

			const [otherProducts] = await connection.query<ISimilarProductEntity[]>(
				OTHER_PRODUCTS_EXCLUDE_SIMILAR_QUERY,
				[req.params.id, req.params.id, req.params.id]
			);

			const product = mapProductsEntity(rows)[0];

			product.similar = similar;
			product.otherProducts = otherProducts;

			if (comments.length) {
				product.comments = mapCommentsEntity(comments);
			}

			if (images.length) {
				product.images = mapImagesEntity(images);
				product.thumbnail =
					product.images.find((image) => image.main) || product.images[0];
			}

			res.send(product);
		} catch (e) {
			throwServerError(res, e);
		}
	}
);

productsRouter.post(
	"/",
	async (req: Request<{}, {}, ProductCreatePayload>, res: Response) => {
		try {
			const { title, description, price, images } = req.body;

			const productId = uuidv4();
			await connection.query<OkPacket>(INSERT_PRODUCT_QUERY, [
				productId,
				title || null,
				description || null,
				price || null,
			]);

			if (images && images.length > 0) {
				const values = images.map((image) => [
					uuidv4(),
					image.url,
					productId,
					image.main,
				]);
				await connection.query<OkPacket>(INSERT_PRODUCT_IMAGES_QUERY, [values]);
			}

			res.status(201);
			res.send(productId);
		} catch (e) {
			throwServerError(res, e);
		}
	}
);

productsRouter.delete(
	"/:id",
	async (req: Request<{ id: string }>, res: Response) => {
		try {
			const [rows] = await connection.query<IProductEntity[]>(
				"SELECT * FROM products WHERE product_id = ?",
				[req.params.id]
			);

			if (!rows?.[0]) {
				res.status(404);
				res.send(`Product with id ${req.params.id} is not found`);
				return;
			}

			await connection.query<OkPacket>(
				"DELETE FROM images WHERE product_id = ?",
				[req.params.id]
			);

			await connection.query<OkPacket>(
				"DELETE FROM comments WHERE product_id = ?",
				[req.params.id]
			);

			await connection.query<OkPacket>(
				"DELETE FROM products WHERE product_id = ?",
				[req.params.id]
			);

			res.status(200);
			res.end();
		} catch (e) {
			throwServerError(res, e);
		}
	}
);

productsRouter.post(
	"/add-images",
	async (req: Request<{}, {}, ProductAddImagesPayload>, res: Response) => {
		try {
			const { productId, images } = req.body;

			if (!images?.length) {
				res.status(400);
				res.send("Images array is empty");
				return;
			}

			const values = images.map((image) => [
				uuidv4(),
				image.url,
				productId,
				image.main,
			]);
			await connection.query<OkPacket>(INSERT_PRODUCT_IMAGES_QUERY, [values]);

			res.status(201);
			res.send(`Images for a product id:${productId} have been added!`);
		} catch (e) {
			throwServerError(res, e);
		}
	}
);

productsRouter.post(
	"/remove-images",
	async (req: Request<{}, {}, ImagesRemovePayload>, res: Response) => {
		try {
			const imagesToRemove = req.body;

			if (!imagesToRemove?.length) {
				res.status(400);
				res.send("Images array is empty");
				return;
			}

			const [info] = await connection.query<OkPacket>(DELETE_IMAGES_QUERY, [
				[imagesToRemove],
			]);

			if (info.affectedRows === 0) {
				res.status(404);
				res.send("No one image has been removed");
				return;
			}

			res.status(200);
			res.send(`Images have been removed!`);
		} catch (e) {
			throwServerError(res, e);
		}
	}
);

productsRouter.post(
	"/update-thumbnail/:id",
	[
		param("id").isUUID().withMessage("Product id is not UUID"),
		body("newThumbnailId")
			.isUUID()
			.withMessage("New thumbnail id is empty or not UUID"),
	],
	async (
		req: Request<{ id: string }, {}, { newThumbnailId: string }>,
		res: Response
	) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400);
				res.json({ errors: errors.array() });
				return;
			}

			const [currentThumbnailRows] = await connection.query<
				IProductImageEntity[]
			>("SELECT * FROM images WHERE product_id=? AND main=?", [
				req.params.id,
				1,
			]);

			if (!currentThumbnailRows?.length || currentThumbnailRows.length > 1) {
				res.status(400);
				res.send("Incorrect product id");
				return;
			}

			const [newThumbnailRows] = await connection.query<IProductImageEntity[]>(
				"SELECT * FROM images WHERE product_id=? AND image_id=?",
				[req.params.id, req.body.newThumbnailId]
			);

			if (newThumbnailRows?.length !== 1) {
				res.status(400);
				res.send("Incorrect new thumbnail id");
				return;
			}

			const currentThumbnailId = currentThumbnailRows[0].image_id;
			const [info] = await connection.query<OkPacket>(
				REPLACE_PRODUCT_THUMBNAIL,
				[
					currentThumbnailId,
					req.body.newThumbnailId,
					currentThumbnailId,
					req.body.newThumbnailId,
				]
			);

			if (info.affectedRows === 0) {
				res.status(404);
				res.send("No one image has been updated");
				return;
			}

			res.status(200);
			res.send("New product thumbnail has been set!");
		} catch (e) {
			throwServerError(res, e);
		}
	}
);

productsRouter.patch(
	"/:id",
	async (
		req: Request<{ id: string }, {}, ProductCreatePayload>,
		res: Response
	) => {
		try {
			const { id } = req.params;

			const [rows] = await connection.query<IProductEntity[]>(
				"SELECT * FROM products WHERE product_id = ?",
				[id]
			);

			if (!rows?.[0]) {
				res.status(404);
				res.send(`Product with id ${id} is not found`);
				return;
			}

			const currentProduct = rows[0];

			await connection.query<OkPacket>(UPDATE_PRODUCT_FIELDS, [
				req.body.hasOwnProperty("title")
					? req.body.title
					: currentProduct.title,
				req.body.hasOwnProperty("description")
					? req.body.description
					: currentProduct.description,
				req.body.hasOwnProperty("price")
					? req.body.price
					: currentProduct.price,
				id,
			]);

			res.status(200);
			res.send(`Product id:${id} has been added!`);
		} catch (e) {
			throwServerError(res, e);
		}
	}
);

productsRouter.get(
	"/similar/:id",
	async (req: Request<{ id: string }>, res: Response) => {
		try {
			const [rows] = await connection.query<IProductEntity[]>(
				GET_SIMILAR_PRODUCTS_QUERY,
				[req.params.id, req.params.id]
			);

			res.send(rows);
		} catch (e) {
			throwServerError(res, e);
		}
	}
);

productsRouter.post(
	"/add-similar",
	[
		body(
			null,
			"Payload must be an array of {productId:UUID,similarProductId:UUID}"
		).isArray(),
		body("*.productId", "must be UUID").isUUID(),
		body("*.similarProductId", "must be UUID").isUUID(),
	],
	async (req: Request<{}, {}, SimilarProductPayload>, res: Response) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const similar = req.body;

			const ids = [];
			const addSimilar = () => {
				const promises = [];
				similar.map((i) => {
					ids.push(i.productId);
					promises.push(
						connection.query<OkPacket>(DELETE_SIMILAR_PRODUCTS_BY_IDS_QUERY, [
							i.productId,
							i.similarProductId,
						])
					);
					promises.push(
						connection.query<OkPacket>(INSERT_SIMILAR_PRODUCTS_QUERY, [
							i.productId,
							i.similarProductId,
						])
					);
				});

				return promises;
			};

			await Promise.all(addSimilar())
				.then(() => {
					res.status(201);
					res.send(
						`Similar Products for Products with ids:${ids.join(
							","
						)} has been added!`
					);
				})
				.catch((e) => {
					res.status(400);
					res.send(e.message);
				});
		} catch (e) {
			throwServerError(res, e);
		}
	}
);

productsRouter.post(
	"/remove-similar",
	[
		body(
			null,
			"Payload must be an array of {productId:UUID,similarProductId:UUID}"
		).isArray(),
		body("*.productId", "must be UUID").isUUID(),
		body("*.similarProductId", "must be UUID").isUUID(),
	],
	async (req: Request<{}, {}, SimilarProductPayload>, res: Response) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const similar = req.body;

			const ids = [];
			const removeSimilar = () => {
				const promises = [];
				similar.map((i) => {
					ids.push(i.productId);
					promises.push(
						connection.query<OkPacket>(DELETE_SIMILAR_PRODUCTS_BY_IDS_QUERY, [
							i.productId,
							i.similarProductId,
						])
					);
				});

				return promises;
			};

			await Promise.all(removeSimilar())
				.then(() => {
					res.status(201);
					res.send(
						`Similar Products for Products with ids:${ids.join(
							","
						)} has been removed!`
					);
				})
				.catch((e) => {
					res.status(400);
					res.send(e.message);
				});
		} catch (e) {
			throwServerError(res, e);
		}
	}
);

productsRouter.post(
	"/remove-similar-all",
	[body(null, "Payload must be array of UUID").isArray()],
	async (req: Request<{}, {}, SimilarProductPayload>, res: Response) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const similar = req.body;

			const ids = [];
			const removeSimilar = () => {
				const promises = [];
				similar.map((i) => {
					ids.push(i);
					promises.push(
						connection.query<OkPacket>(DELETE_SIMILAR_PRODUCTS_QUERY, [i, i])
					);
				});

				return promises;
			};

			await Promise.all(removeSimilar())
				.then(() => {
					res.status(201);
					res.send(
						`Similar Products for Products with ids:${ids.join(
							","
						)} has been removed!`
					);
				})
				.catch((e) => {
					res.status(400);
					res.send(e);
				});
		} catch (e) {
			throwServerError(res, e);
		}
	}
);
