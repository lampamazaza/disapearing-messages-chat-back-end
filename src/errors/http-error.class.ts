export class HTTPError extends Error {
	statusCode: number;
	context?: string;
	stack?: string;

	constructor(statusCode: number, message: string, context?: string, stack?: string) {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
		this.context = context;
		this.stack = stack;
	}
}
