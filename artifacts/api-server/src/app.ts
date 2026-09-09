import { createRequire } from "node:module";
import express, { type Express, type RequestHandler } from "express";
import cors from "cors";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const require = createRequire(import.meta.url);

type PinoRequest = {
  id: string;
  method?: string;
  url?: string;
};

type PinoResponse = {
  statusCode?: number;
};

type PinoHttpOptions = {
  logger?: typeof logger;
  serializers?: {
    req?: (req: PinoRequest) => object;
    res?: (res: PinoResponse) => object;
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
