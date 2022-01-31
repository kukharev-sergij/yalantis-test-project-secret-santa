import { validationResult, } from 'express-validator';
import validator from 'validator';

const optional = { options: { nullable: false, }, };

export { validator, optional, };

export async function validate(
  req: Request,
  res: Response,
  next: Function,
): Promise<void> {
  const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new ApiValidationError({ errors: errors.array(), });
	}
	next();
}

interface ApiValidationErrorConstructorArguments {
	errors: Array<Object>,
}

export class ApiValidationError extends Error {
	private _errors: Array<Object> = [];

  constructor ({
		errors,
	}: ApiValidationErrorConstructorArguments) {
		super();
		this._errors = errors;
	}

	getErrors() {
		return this._errors;
	}
}
