import { ComponentProps, ReactNode } from "react";
import s from "./Button.module.css";
import clsx from "clsx";

type ButtonProps = ComponentProps<"button"> & { text?: string | ReactNode };
export const Button = (props: ButtonProps) => {
	const { children = null, className = "", text, ...buttonProps } = props;
	return (
		<button className={clsx(s.button, className)} {...buttonProps}>
			{children || text}
		</button>
	);
};
