"use client";
import { ComponentProps, useState } from "react";

import { API_URL } from "@/shared/api-const";
import { IProduct } from "@SharedTypes";

import axios from "axios";
import { KeyedMutator } from "swr";
import { errorText } from "@/shared/axios/error";

import { FormItemChangeEvent } from "@/shared/ui/types";
import { Button, Input, TextArea } from "@/shared/ui";
import s from "./CommentForm.module.css";

type CommentFormProps = ComponentProps<"form"> & {
	productId: string;
	refreshComments: KeyedMutator<IProduct | null>;
};

export const CommentForm = (props: CommentFormProps) => {
	const { productId, refreshComments, ...formProps } = props;
	const initValues = {
		name: "",
		email: "",
		body: "",
		productId: productId,
	};

	const [commentValues, setCommentValues] = useState(initValues);

	const handleFormItem = (e: FormItemChangeEvent) => {
		const formItemValues = { [e.target.name]: e.target.value };
		setCommentValues({ ...commentValues, ...formItemValues });
	};

	return (
		<form
			className={s.form}
			method="POST"
			action={`${API_URL}/comments`}
			{...formProps}
		>
			<div className={s.mainFields}>
				<div className={s.formItem}>
					<label>Заголовок</label>
					<Input
						onChange={handleFormItem}
						autoComplete="off"
						value={commentValues.name}
						required
						name="name"
						type="text"
						placeholder="Введите заголовок"
					/>
				</div>

				<div className={s.formItem}>
					<label>E-mail</label>
					<Input
						onChange={handleFormItem}
						role="presentation"
						autoComplete="off"
						value={commentValues.email}
						required
						name="email"
						type="email"
						placeholder="Введите email"
					/>
				</div>
			</div>

			<div className={s.formItem}>
				<label>Текст комментария</label>
				<TextArea
					onChange={handleFormItem}
					value={commentValues.body}
					required
					name="body"
					placeholder="Введите текст комментария"
					rows={4}
				></TextArea>
			</div>

			<input
				readOnly
				name="productId"
				value={productId}
				style={{ display: "none" }}
			/>
			<Button
				onClick={(e) => {
					e.preventDefault();
					axios
						.post(`${API_URL}/comments`, commentValues)
						.then((res) => {
							refreshComments();
							setCommentValues(initValues);
						})
						.catch((e) => {
							alert(errorText(e));
						});
				}}
				type="submit"
			>
				Сохранить
			</Button>
		</form>
	);
};
