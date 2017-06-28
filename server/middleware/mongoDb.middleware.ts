import { NextFunction, Request, Response, Router } from "express";
import * as mongoose from "mongoose";

export const mongoDbConnection = (request: Request, response: Response, next: NextFunction) => {
    (<any> mongoose).Promise = global.Promise;
    mongoose.connect("mongodb://localhost:27017/node-crm");
    mongoose.set("debug", true);
    response.on("finish", () => {
        mongoose.connection.close();
    });
    next();
};
