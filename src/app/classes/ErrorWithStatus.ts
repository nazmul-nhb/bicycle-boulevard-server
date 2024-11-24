/**
 * Create an instance of `Error` with custom properties
 *
 * @param name Error name
 * @param message Error message
 * @param status HTTP status code
 * @param type Type of Error
 * @param value Value for the Error
 * @param path Optional path for Error, default is `unknown`
 */
export class ErrorWithStatus extends Error {
	constructor(
		public name: string,
		public message: string,
		public status: number,
		public type: string,
		public value: string,
		public path: string = 'unknown',
	) {
		super(message);
		this.name = name;
		this.status = status;
		this.type = type;
		this.value = value;
		this.path = path;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
