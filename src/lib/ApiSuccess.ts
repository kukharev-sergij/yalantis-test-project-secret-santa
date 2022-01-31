interface ApiValidationErrorConstructorArguments {
	data: any,
};

export class ApiSuccess extends Error {
	private _data: any = null;

  constructor ({
		data,
	}: ApiValidationErrorConstructorArguments) {
		super();
		this._data = data;
	}

	getData() {
		return this._data;
	}
}
