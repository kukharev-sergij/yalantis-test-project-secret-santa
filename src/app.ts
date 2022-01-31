import express from 'express';
import 'express-async-errors';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { normalize, resolve, } from 'path';
import process from 'process';

import { ApiSuccess, } from './lib/ApiSuccess';
import { ApiRequestError, } from './lib/ApiRequestError';
import { ApiValidationError, } from './lib/ApiValidationError';
import * as api from './api';

const { env, } = process;
const { COOKIE_SECRET='0123456789', } = env;

const app = express();
const root = normalize(__dirname);
const repo = normalize(resolve(root, '..'));

app.set('app', app);
app.set('root', root);
app.set('repo', repo);

app.use(express.json({
  inflate: true,
  limit: '1mb',
  type: [
    'application/json',
    'application/*+json',
  ],
  verify: (req, res, buf, encoding) => undefined,
}));

app.use(express.raw({
  inflate: true,
  limit: '1mb',
  type: [
    'application/octet-stream',
  ],
  verify: (req, res, buf, encoding) => undefined,
}));

app.use(express.text({
  defaultCharset: 'utf-8',
  inflate: true,
  limit: '1mb',
  type: [
    'text/plain',
  ],
  verify: (req, res, buf, encoding) => undefined,
}));

app.use(express.urlencoded({
  extended: true,
  inflate: true,
  limit: '2kb',
  parameterLimit: 1000,
  type: [
    'application/x-www-form-urlencoded',
  ],
  verify: (req, res, buf, encoding) => undefined,
}));

app.use(cors((req, done) => {
  done(null, { origin: true }); // - reflect
  // done(null, { origin: false }); // - allow
}));

app.use(cookieParser(COOKIE_SECRET, {}));

app.use('/api', api.router);

app.all('*', async (req, res, next) => {
	const text = `Unknown route ${ req.method }:${ req.url }`;
	next(new Error(text));
});

app.use((
	error: Error,
	request: Request,
	response: Response,
	next: Function,
) => {
	if (error instanceof ApiSuccess) {
		response.status(200).json({
			data: error.getData(),
		});
	} else if (error instanceof ApiRequestError) {
		response.status(404).json({
			error: error.getError(),
			text: error.getText(),
		});
	} else if (error instanceof ApiValidationError) {
		response.status(500).json({
			errors: error.getErrors(),
		});
	} else if (error instanceof Error) {
		response.status(500).json({
			error: error.message,
			stack: error.stack,
		});
	} else if (error) {
		response.status(500).json({
			error,
		});
	} else {
		response.status(404).json({
			unknown: true,
		});
	}
});

http.createServer(app)
	.listen(env.PORT ?? 4000, () => {
		console.log('Server started!');
	});