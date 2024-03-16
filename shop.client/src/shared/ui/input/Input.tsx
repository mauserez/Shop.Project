import React from "react";
import { ComponentProps } from "react";

import s from "./Input.module.css";
import clsx from "clsx";

export type InputProps = ComponentProps<"input">;
export const Input = (props: InputProps) => {
	const { className = "", autoComplete = "off", ...inputProps } = props;

	return (
		<input
			autoComplete={autoComplete}
			className={clsx(s.input, className)}
			{...inputProps}
		/>
	);
};
