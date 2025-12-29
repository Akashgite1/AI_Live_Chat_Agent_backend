import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import chatRoutes from './routes/chat.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/health', (_, res) => res.json({ status: 'OK' }));

app.use('/api/chat', chatRoutes);
app.use(errorMiddleware);

export default app;
