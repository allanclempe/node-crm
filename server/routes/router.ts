import { Request, Response, Router } from "express";
import { environmentRouter, projectRouter, userRouter } from "./identity/identity.router";
import { schemaRouter, dataRouter } from "./crm/crm.router";

const apiRouter = (): Router => {
    const router: Router = Router();

    router.use("/identity/user", userRouter());
    router.use("/identity/project", projectRouter());
    router.use("/identity/environment", environmentRouter());
    router.use("/crm/schema", schemaRouter());
    router.use("/crm/data", dataRouter());

    return router;
};

export { apiRouter };
