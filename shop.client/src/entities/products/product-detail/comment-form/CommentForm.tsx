"use client";
import { ComponentProps, useState } from "react";

import { API_URL } from "@/shared/api-const";
import { IProduct } from "@SharedTypes";

import axios from "axios";
import { KeyedMutator } from "swr";
import { errorText } from "@/shared/axios/error";
import { object, string } from "yup";

import { FormItemChangeEvent } from "@/shared/ui/types";
import { Button, Input, TextArea } from "@/shared/ui";
import s from "./CommentForm.module.css";

const commentSchema = object({
	body: string().trim().required("Введите текст комментария"),
	email: string().email("Введите корректный Email").required("Введите Email"),
	name: string().trim().required("Введите заголовок комментария"),
});

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
	const [error, setError] = useState("");

	const handleFormItem = (e: FormItemChangeEvent) => {
		const formItemValues = { [e.target.name]: e.target.value };
		setCommentValues({ ...commentValues, ...formItemValues });
		setError("");
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

					commentSchema
						.validate(commentValues)
						.then(() => {
							axios
								.post(`${API_URL}/comments`, commentValues)
								.then(() => {
									refreshComments();
									setCommentValues(initValues);
								})
								.catch((e) => {
									console.log(errorText(e));
								});
						})
						.catch((e) => {
							setError(e.errors[0]);
						});
				}}
				type="submit"
			>
				Сохранить
			</Button>
			<div className={s.error}>{error}</div>
		</form>
	);
};
