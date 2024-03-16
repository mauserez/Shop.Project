"use client";

import { API_URL } from "@/shared/api-const";
import { IProduct } from "@SharedTypes";

import { ComponentProps, useState } from "react";
import { ChangeEvent } from "react";

import axios from "axios";
import { KeyedMutator } from "swr";
import { errorText } from "@/shared/axios/error";

import { Button } from "@/shared/ui/button/Button";
import s from "./CommentForm.module.css";

type CommentFormProps = ComponentProps<"form"> & {
	productId: string;
	refreshComments: KeyedMutator<IProduct | null>;
};

type FormItemChangeEvent =
	| ChangeEvent<HTMLInputElement>
	| ChangeEvent<HTMLTextAreaElement>;

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
			{...formProps}
			method="POST"
			action={`${API_URL}/comments`}
		>
			<div className={s.mainFields}>
				<div className={s.formItem}>
					<label>Заголовок</label>
					<input
						onChange={handleFormItem}
						autoComplete="off"
						value={commentValues.name}
						required
						name="name"
						type="text"
						placeholder="Введите заголовок"
					></input>
				</div>

				<div className={s.formItem}>
					<label>E-mail</label>
					<input
						onChange={handleFormItem}
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
				<textarea
					onChange={handleFormItem}
					value={commentValues.body}
					required
					name="body"
					placeholder="Введите текст комментария"
					rows={4}
				></textarea>
			</div>

			<input
				readOnly
				style={{ display: "none" }}
				name="productId"
				value={productId}
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
