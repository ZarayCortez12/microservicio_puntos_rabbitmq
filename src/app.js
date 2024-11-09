import express from 'express';
import morgan from 'morgan';

app.use(morgan('dev'));

const app = express();

export default app;