// import { NextFunction, Request, Response, Router } from "express";
// import * as mongoose from "mongoose";
// import entity from "../core/entityModel";
// import { parameters } from "../environment/environment";

// export const mongooseInitialize = (request: Request, response: Response, next: NextFunction) => {
//     const cfg = parameters();
//     entity.bootloader(cfg.mongoDb.modelInMemory).then(() => {
//         next();
//     });
// };
