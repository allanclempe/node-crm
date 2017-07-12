import { Request, Response, Router } from "express";
import { userLogin, userPost, userPut, userLoginCrm } from "./user.route";
import { projectPost, projectPut } from "./project.route";
import { environmentGet, environmentLogin, environmentPost, environmentPut } from "./environment.route";
import { mongoDbConnection } from "../../middleware/mongoDb.middleware";
import { parameters } from "../../environment/environment";

const userRouter = (): Router => {
  const router: Router = Router();
  const cfg = parameters();

  router.use(mongoDbConnection(cfg.mongoDb.name, false));
  router.post("/", userPost);
  router.post("/login", userLogin);
  router.post("/crm/login", userLoginCrm);
  router.put("/:id", userPut);

  return router;
};

const projectRouter = (): Router => {
  const router: Router = Router();
  const cfg = parameters();

  router.use(mongoDbConnection(cfg.mongoDb.name, false));
  router.post("/", projectPost);
  router.put("/:id", projectPut);

  return router;
};

const environmentRouter = (): Router => {
  const router: Router = Router();
  const cfg = parameters();

  router.use(mongoDbConnection(cfg.mongoDb.name, false));
  router.get("/", environmentGet);
  router.post("/login", environmentLogin);
  router.post("/", environmentPost);
  router.put("/:id", environmentPut);

  return router;
};

export { userRouter, projectRouter, environmentRouter};
