import cors from 'cors';
import express from 'express';
import utilities from './app/utilities';
import type { Application, NextFunction, Request, Response } from 'express';
import { productRoutes } from './app/modules/product/product.routes';
import { UnifiedError } from './app/classes/UnifiedError';
import { ErrorWithStatus } from './app/classes/ErrorWithStatus';

const app: Application = express();

app.use(cors());
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

// Error handler for 404
app.use((req: Request, _res: Response, next: NextFunction) => {
	const error = new ErrorWithStatus(
		'NotFoundError',
		`Requested End-Point “${req.method}: ${req.url}” Not Found!`,
		404,
		'not_found',
		'url',
	);
	next(error);
});

// Global Error Handler
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
	// get unified error in structured format
	const unifiedError = new UnifiedError(error, req.body);

	// Log error msg in the server console
	console.error(`🛑 Error: ${utilities.processErrorMsgs(error)}`);

	// Delegate to the default Express error handler if the headers have already been sent to the client
	if (res.headersSent) {
		return next(error);
	}

	res.status((error as ErrorWithStatus)?.status || 500).json(
		unifiedError.parseErrors(),
	);
});

export default app;
