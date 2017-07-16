import { NextFunction, Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import * as idValidator from "mongoose-id-validator";
import { SchemaSchema } from "../core/schema/schema.schema";
import { ISchemaDocument } from "../core/schema";

export const mongoModel = () => {
    return (request: Request, response: Response, next: NextFunction) => {
        if (!response.locals.conn) {
            return next();
        }
        const conn: mongoose.Connection = response.locals.conn;
        conn.model("Schema", SchemaSchema, "sys_schemas").find((err: any, schemas: ISchemaDocument[]) => {
            if (!!err) {
                return response.status(400).json(err);
            }

            const modelNames = conn.modelNames();
            schemas.forEach(schema => {
                if (modelNames.indexOf(schema.name) === -1) {
                    const mSchema = new mongoose.Schema(schema.definition);
                    mSchema.plugin(idValidator, {connection: conn});
                    conn.model(schema.name, mSchema);
                }
            });

            next();

        });
    };
};
