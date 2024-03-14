import { ProductInfo } from "@/entities/products";
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

	return <ProductInfo productId={params.productId} />;
}
