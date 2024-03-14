import { ProductList } from "@/entities/products/product-list/ProductList";
import { Suspense } from "react";
import { FadeLoader } from "react-spinners";
import s from "./page.module.css";

export default async function ProductListPage() {
	return (
		<section className={s.section}>
			<Suspense
				fallback={
					<div className={s.loader}>
						<FadeLoader color="#ffffff" />
					</div>
				}
			>
				<ProductList />
			</Suspense>
		</section>
	);
}
