interface ApiRequestErrorConstructorArguments {
	error?: Error,
	text: string,
}

export class ApiRequestError extends Error {
	private _error: Error = null;
	private _text: string = null;

  constructor ({
		error,
		text,
	}: ApiRequestErrorConstructorArguments) {
		super();
		this._error = error;
		this._text = text;
	}

	getError() {
		return this._error;
	}

	getText() {
		return this._text;
	}

}
