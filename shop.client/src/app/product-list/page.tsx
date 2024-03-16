import { ProductList } from "@/widgets/product-list/ProductList";
import s from "./page.module.css";

export default async function ProductListPage() {
	return (
		<section className={s.section}>
			<ProductList />
		</section>
	);
}
