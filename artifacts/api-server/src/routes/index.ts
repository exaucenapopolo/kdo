import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import paymentRouter from "./payment.js";
import twilioSandboxRouter from "./twilio-sandbox.js";
import adminRouter from "./admin.js";
import usersRouter from "./users.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(paymentRouter);
router.use(twilioSandboxRouter);
router.use(adminRouter);
router.use(usersRouter);

export default router;
