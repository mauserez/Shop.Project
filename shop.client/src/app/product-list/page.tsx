import { ProductList } from "@/widgets/product-card-list/ProductCardList";
import s from "./page.module.css";

export default async function ProductListPage() {
	return (
		<section className={s.section}>
			<ProductList />
		</section>
	);
}
