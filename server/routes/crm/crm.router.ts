import { Request, Response, Router } from "express";
import { parameters } from "../../environment/environment";
import { mongoDbConnection } from "../../middleware/mongoDb.middleware";
import { mongoModel } from "../../middleware/mongoModel.middleware";
import { dataGet, dataPost, dataPut, dataStats } from "./data.route";
import { schemaPost, schemaGet, schemaSingle } from "./schema.route";

const cfg = parameters();

const dataRouter = (): Router => {
    const router: Router = Router();

    router.use(mongoDbConnection(cfg.mongoDb.name, true));
    router.use(mongoModel());
    router.get("/:entity", dataGet);
    router.get("/:entity/stats", dataStats);
    router.post("/:entity", dataPost);
    router.put("/:entity/:id", dataPut);

    return router;
};

const schemaRouter = (): Router => {
    const router: Router = Router();

    router.use(mongoDbConnection(cfg.mongoDb.name, true));
    router.post("/:entity", schemaPost);
    router.get("/:id", schemaSingle);
    router.get("", schemaGet);

    return router;
};


export { dataRouter, schemaRouter };
