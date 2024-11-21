export interface ErrorWithStatus extends Error {
	status?: number;
}

export interface MongoError {
	errorResponse: {
		index: number;
		code: number;
		errmsg: string;
		keyPattern: Record<string, number>;
		keyValue: Record<string, string>;
	};
	index: number;
	code: number;
	keyPattern: Record<string, number>;
	keyValue: Record<string, string>;
}

export interface ParserError {
	expose: boolean;
	statusCode: number;
	status: number;
	body: string;
	type: string;
}
