import { ComponentProps } from "react";
import { IComment } from "@SharedTypes";

import s from "./Comments.module.css";

type CommentsProps = ComponentProps<"div"> & {
	comments: IComment[];
};

export const Comments = (props: CommentsProps) => {
	const { comments, ...otherProps } = props;

	if (!comments || comments.length === 0) {
		return <h3>К сожалению тут еще никто ничего не написал</h3>;
	}

	return (
		<div className={s.commentList} {...otherProps}>
			{comments.map((comment) => (
				<div className={s.comment} key={comment.id}>
					<div className={s.titleContainer}>
						<div>{comment.name}</div>
						<div>{comment.email}</div>
					</div>
					<div>{comment.body}</div>
				</div>
			))}
		</div>
	);
};
