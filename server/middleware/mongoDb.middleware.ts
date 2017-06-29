import { NextFunction, Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import { parameters } from "../environment/environment";

export const mongoDbConnection = (request: Request, response: Response, next: NextFunction) => {
    const cfg = parameters();
    (<any> mongoose).Promise = global.Promise;
    mongoose.connect(`mongodb://${cfg.mongoDb.host}/node-crm`);
    mongoose.set("debug", cfg.mongoDb.debug);
    response.on("finish", () => {
        mongoose.connection.close();
    });
    next();
};
