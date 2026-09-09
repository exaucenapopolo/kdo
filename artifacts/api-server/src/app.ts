import { createRequire } from "node:module";
import type { IncomingMessage, ServerResponse } from "node:http";
import express, { type Express, type RequestHandler } from "express";
import cors from "cors";
import router from "./routes";
import { logger } from "./lib/logger";

const require = createRequire(import.meta.url);

type PinoHttpOptions = {
  logger?: typeof logger;
  serializers?: {
    req?: (req: IncomingMessage) => object;
    res?: (res: ServerResponse) => object;
  };
};

type PinoHttpFactory = (
  options?: PinoHttpOptions,
) => RequestHandler;

const pinoHttp = require("pino-http") as PinoHttpFactory;

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
