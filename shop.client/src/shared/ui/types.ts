import { ChangeEvent } from "react";

export type FormItemChangeEvent =
	| ChangeEvent<HTMLInputElement>
	| ChangeEvent<HTMLTextAreaElement>;
