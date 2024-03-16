import { ProductDetail } from "@/widgets/product-detail/ProductDetail";
import { notFound } from "next/navigation";

export default function ProductInfoPage(props: {
	params: { productId: string };
	searchParams: {};
}) {
	const { params } = props;
	const { productId } = params;

	if (!productId) {
		notFound();
	}


	return <ProductDetail productId={params.productId} />;
}
