export class ErrorWithStatus extends Error {
	constructor(
		public name: string,
		public message: string,
		public status: number,
        public type: string,
        public value: string
	) {
		super(message);
		this.name = name;
		this.status = status;
		this.type = type;
        this.value = value;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
