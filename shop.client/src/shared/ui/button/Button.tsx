import { ComponentProps, ReactNode } from "react";
import s from "./Button.module.css";

type ButtonProps = ComponentProps<"button"> & { text?: string | ReactNode };
export const Button = (props: ButtonProps) => {
	const { children = null, text } = props;
	return (
		<button className={s.button} {...props}>
			{children || text}
		</button>
	);
};
