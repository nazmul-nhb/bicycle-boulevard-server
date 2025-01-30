import cors from 'cors';
import express from 'express';
import router from './app/routes';
import configs from './app/configs';
import cookieParser from 'cookie-parser';
import sendResponse from './app/utilities/sendResponse';
import type { Application, Request, Response } from 'express';
import {
	catchAllErrors,
	handleRouteNotFound,
} from './app/middlewares/errorHandlers';

// * Create an Express App
const app: Application = express();

// * Respect CORS Policy
app.use(
	cors({
		origin:
			configs.NODE_ENV === 'development' ?
				'http://localhost:5173'
			:	'https://bicycle-boulevard-nhb.vercel.app',
		credentials: true,
	}),
);

// * Use Cookie Parser
app.use(cookieParser());
// * Use JSON Parser
app.use(express.json());

// * Root/Test Route
app.get(['/', '/api'], (_req: Request, res: Response) => {
	sendResponse(res, 'N/A', 'OK', null, '🚴‍♂️ Bicycle Server is Running! 🏃');
});

// * Application Routes
app.use('/api', router);

// * Error handler for 404 or invalid request
app.use(handleRouteNotFound);

// * Global error handler to catch and send error responses
app.use(catchAllErrors);

export default app;
