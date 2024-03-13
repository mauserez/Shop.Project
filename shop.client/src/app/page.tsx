import Image from "next/image";
import s from "./page.module.css";
import { IProduct } from "../../../Shared/types";
import { getData } from "@/shared/helpers/get";
import { calcCountAndSum } from "@/entities/products/helpers";
import { ADMIN_URL } from "@/shared/const";
import { Button } from "@/shared/ui/button/Button";
import Link from "next/link";

export default async function Home() {
	const allProducts = await getData<IProduct[]>("/products");

	const countAndSum = calcCountAndSum(allProducts || []);

	return (
		<section className={s.section}>
			<h1>Shop.Client</h1>
			<p>
				В базе данных находится{" "}
				<span className={s.productValue}>{countAndSum.count}</span> товаров
				общей стоимостью
				<span className={s.productValue}>{countAndSum.priceSum}</span> руб.
			</p>
			<div className={s.buttons}>
				<Link href={"/product-list"}>
					<Button type="button">Перейти к списку товаров</Button>
				</Link>
				<Link href={ADMIN_URL}>
					<Button type="button">Перейти в систему администрирования</Button>
				</Link>
			</div>
		</section>
	);
}
