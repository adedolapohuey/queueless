import express, { Application } from "express";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";
import router from "./routes";
import cors from "cors";
import { errorHandler } from "./helpers/errorHandler";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(cors());

// Routes
app.use(router);

// Global error handler
app.use(errorHandler);

export default app;
