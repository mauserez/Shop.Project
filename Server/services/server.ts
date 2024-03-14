import express, { Express } from "express";
import cors from "cors";

const host = process.env.LOCAL_PATH;
const port = Number(process.env.LOCAL_PORT);

export function initServer(): Express {
	const app = express();
	app.use(cors());

	const jsonMiddleware = express.json();
	app.use(jsonMiddleware);

	app.listen(port, host, () => {
		console.log(`Server running on port ${port}`);
	});

	return app;
}
