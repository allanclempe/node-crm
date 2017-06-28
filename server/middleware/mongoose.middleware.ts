import { NextFunction, Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import entity from "../core/entityModel";

export const mongooseInitialize = (request: Request, response: Response, next: NextFunction) => {
    entity.bootloader().then(() => {
        next();
    });
};
