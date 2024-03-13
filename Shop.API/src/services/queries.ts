export const COMMENT_DUPLICATE_QUERY = `
  SELECT * FROM comments c
  WHERE LOWER(c.email) = ?
  AND LOWER(c.name) = ?
  AND LOWER(c.body) = ?
  AND c.product_id = ?
`;

export const INSERT_COMMENT_QUERY = `
  INSERT INTO comments
  (comment_id, email, name, body, product_id)
  VALUES
  (?, ?, ?, ?, ?)
`;

export const INSERT_PRODUCT_QUERY = `
  INSERT INTO products
  (product_id, title, description, price)
  VALUES
  (?, ?, trim(?), ?)
`;

export const INSERT_PRODUCT_IMAGES_QUERY = `
  INSERT INTO images
  (image_id, url, product_id, main)
  VALUES ?
`;

export const DELETE_IMAGES_QUERY = `
  DELETE FROM images
  WHERE image_id IN ?;
`;

export const REPLACE_PRODUCT_THUMBNAIL = `
  UPDATE images
  SET main = CASE
    WHEN image_id = ? THEN 0
    WHEN image_id = ? THEN 1
    ELSE main
  END
  WHERE image_id IN (?, ?);
`;

export const UPDATE_PRODUCT_FIELDS = `
    UPDATE products
    SET title = ?, description = ?, price = ?
    WHERE product_id = ?
`;

export const GET_SIMILAR_PRODUCTS_QUERY = `
  SELECT
    p.product_id as productId,
    p.title,
    p.description,
    p.price
  FROM products p
  JOIN similar_products sp on
  (p.product_id = sp.similar_product_id and sp.product_id = ?)
  or
  (p.product_id = sp.product_id and sp.similar_product_id = ?)
`;

export const INSERT_SIMILAR_PRODUCTS_QUERY = `
  INSERT similar_products
  (product_id,similar_product_id)
  VALUES
  (?,?)
`;

export const DELETE_SIMILAR_PRODUCTS_BY_IDS_QUERY = `
  DELETE FROM similar_products
  WHERE product_id = ?
  and similar_product_id = ?
`;

export const DELETE_SIMILAR_PRODUCTS_QUERY = `
  DELETE FROM similar_products
  WHERE product_id = ? or similar_product_id = ?
`;

export const OTHER_PRODUCTS_EXCLUDE_SIMILAR_QUERY = `
  SELECT
    distinct
    p.product_id as productId,
    p.title,
    p.price,
    p.description
  FROM
  products p
  JOIN (
    SELECT
      p.product_id
    FROM products p
    JOIN similar_products sp on
    (p.product_id = sp.similar_product_id and sp.product_id = ?)
    or
    (p.product_id = sp.product_id and sp.similar_product_id = ?)
  ) v on p.product_id != v.product_id and p.product_id <> ?
`;
