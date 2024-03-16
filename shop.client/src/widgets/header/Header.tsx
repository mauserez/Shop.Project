import { ADMIN_URL } from "@/shared/api-const";
import Link from "next/link";
import s from "./Header.module.css";
import { Button } from "@/shared/ui/button/Button";

export const Header = () => {
	return (
		<header className={s.header}>
			<div className={s.logo}>
				<Link href={"/"}>Shop.Client</Link>
			</div>
			<nav className={s.nav}>
				<Link href={"/"}>
					<Button>Главная</Button>
				</Link>
				<a href={"/product-list"}>
					<Button>Список продуктов</Button>
				</a>
				<Link href={ADMIN_URL}>
					<Button>Админка</Button>
				</Link>
			</nav>
		</header>
	);
};
