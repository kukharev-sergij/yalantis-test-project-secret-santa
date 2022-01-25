import express from 'express';
import 'express-async-errors';
import http from 'http';
import process from 'process';

const app = express();
const { env, } = process;

app.use((error, request, response, next) => {
	if (error instanceof Error) {
		const { message, stack, } = error;
		response.status(500).json({ error: message, stack, });
	} else if (error) {
		response.status(500).json({ error, });
	} else {
		response.status(404).json({ unknown: true, });
	}
});

http.createServer(app)
	.listen(env.PORT ?? 4000, () => {
		console.log('Server started!');
	});