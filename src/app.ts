import cors from 'cors';
import express from 'express';
import utilities from './app/utilities';
import type { Application, NextFunction, Request, Response } from 'express';
import { productRoutes } from './app/modules/product/product.routes';
import { orderRoutes } from './app/modules/order/order.routes';
import { UnifiedError } from './app/classes/UnifiedError';
import { ErrorWithStatus } from './app/classes/ErrorWithStatus';

const app: Application = express();

// Respect CORS Policy
app.use(cors());
// Use JSON Parser
app.use(express.json());

// Root/Test Route
app.get('/', (_req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: '🚴‍♂️ Bicycle Server is Running! 🏃',
	});
});

// Application Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error handler for 404
app.use((req: Request, _res: Response, next: NextFunction) => {
	const error = new ErrorWithStatus(
		'NotFoundError',
		`Requested End-Point “${req.method}: ${req.url}” Not Found!`,
		404,
		'not_found',
		req.url,
		`${req.method}: ${req.url}`,
	);
	next(error);
});

// Global Error Handler
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
	// get unified error in structured format
	const unifiedError = new UnifiedError(error, req.body);

	const { processErrorMsgs, parseStatusCode } = utilities;

	// Log error msg in the server console
	console.error(`🛑 Error: ${processErrorMsgs(error)}`);

	// Delegate to the default Express error handler
	// if the headers have already been sent to the client
	if (res.headersSent) {
		return next(error);
	}

	// Send error response with status code
	res.status(parseStatusCode(error)).json(unifiedError.parseErrors());
});

export default app;
