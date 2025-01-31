import type { RequestHandler } from 'express';

/** * Middleware to parse `data` and attach the parsed object to `req.body`. */
export const parseFormData: RequestHandler = (req, _res, next) => {
	try {
		// console.log(req.body);
		if (req.body.data) {
			req.body = JSON.parse(req.body.data);
		}
		// console.log(req.user);
		// const parsedBody: Record<string, unknown> = {};
		// if (req.body) {
		// 	Object.entries(req.body).forEach(([key, value]) => {
		// 		if (typeof value !== 'string') {
		// 			parsedBody[key] = value; // Keep non-string values as they are
		// 			return;
		// 		}

		// 		// Try parsing JSON
		// 		try {
		// 			const parsedValue = JSON.parse(value);
		// 			parsedBody[key] = parsedValue;
		// 		} catch {
		// 			// Convert boolean-like strings
		// 			if (value === 'true') {
		// 				parsedBody[key] = true;
		// 			} else if (value === 'false') {
		// 				parsedBody[key] = false;
		// 			} else if (!isNaN(Number(value))) {
		// 				parsedBody[key] = Number(value);
		// 			} else {
		// 				parsedBody[key] = value; // Keep as string if no transformation applies
		// 			}
		// 		}
		// 	});
		// }
		// // Attach parsed body and files to the request object
		// req.body = parsedBody;

		next();
	} catch (error) {
		next(error);
	}
};
