import React from "react";
import { ComponentProps } from "react";

import s from "./Textarea.module.css";
import clsx from "clsx";

export type TextAreaProps = ComponentProps<"textarea">;
export const TextArea = (props: TextAreaProps) => {
	const {
		children,
		className = "",
		autoComplete = "off",
		...textAreaProps
	} = props;

	return (
		<textarea
			autoComplete={autoComplete}
			className={clsx(s.textarea, className)}
			{...textAreaProps}
		>
			{props.children}
		</textarea>
	);
};
