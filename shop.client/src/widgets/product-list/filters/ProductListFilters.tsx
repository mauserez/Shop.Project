import React, { ComponentProps, Dispatch, SetStateAction } from "react";
import { Input, Button } from "@/shared/ui";
import { FormItemChangeEvent } from "@/shared/ui/types";

import s from "./ProductListFilters.module.css";

export type SearchPayloadType = {
	title: string;
	priceFrom: number | "";
	priceTo: number | "";
};

type ProductListFiltersProps = ComponentProps<"form"> & {
	initFilters: SearchPayloadType;
	filters: SearchPayloadType;
	tempFilters: SearchPayloadType;
	setTempFilters: Dispatch<SetStateAction<SearchPayloadType>>;
	setFilters: Dispatch<SetStateAction<SearchPayloadType>>;
};

export const ProductListFilters = (props: ProductListFiltersProps) => {
	const { tempFilters, filters, setFilters, setTempFilters, initFilters } =
		props;

	const handleFormItem = (e: FormItemChangeEvent) => {
		const formItemValues = { [e.target.name]: e.target.value };
		setTempFilters({ ...filters, ...formItemValues });
	};

	return (
		<form className={s.productFilter}>
			<div className={s.formItem}>
				<label>Название</label>
				<Input
					onChange={handleFormItem}
					name="title"
					placeholder="Введите название"
					value={tempFilters.title}
				/>
			</div>

			<div className={s.formItem}>
				<label>Цена от</label>
				<Input
					type="number"
					width={100}
					onChange={handleFormItem}
					name="priceFrom"
					placeholder="0"
					value={tempFilters.priceFrom}
				/>
			</div>

			<div className={s.formItem}>
				<label>Цена до</label>
				<Input
					type="number"
					width={100}
					onChange={handleFormItem}
					name="priceTo"
					placeholder="0"
					value={tempFilters.priceTo}
				/>
			</div>

			<Button
				className={s.submitButton}
				onClick={(e) => {
					e.preventDefault();
					setFilters(tempFilters);
				}}
			>
				Найти
			</Button>

			<Button
				className={s.clearButton}
				onClick={(e) => {
					e.preventDefault();
					setTempFilters({ ...initFilters });
				}}
			>
				Очистить
			</Button>
		</form>
	);
};
