import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import paymentRouter from "./payment";
import twilioSandboxRouter from "./twilio-sandbox";
import adminRouter from "./admin";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(paymentRouter);
router.use(twilioSandboxRouter);
router.use(adminRouter);
router.use(usersRouter);

export default router;
