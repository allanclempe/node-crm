import { Request, Response, Router } from "express";
import { ISchema, ISchemaModel } from "../../core";
import { SchemaSchema } from "../../core/schema/schema.schema";
import * as mongoose from "mongoose";

const schemaPost = (request: Request, response: Response) => {

    const entityName = request.params.entity;
    const environmentId = request.body.environmentId;
    const schemaDefinition = request.body.definition;
    const conn: mongoose.Connection = response.locals.conn;

    conn.model("Schema", SchemaSchema, "sys_schemas").find({ name: entityName }, (err: any, queryResult: ISchema[]) => {

        const schemaModel = <ISchemaModel>conn.model("Schema");
        const schema = !!queryResult.length
            ? new schemaModel(queryResult[0])
            : new schemaModel({ name: entityName, environmentId });

        const schemaValidator = schema.validateDefinition(schemaDefinition);

        if (!schemaValidator.valid) {
            response.status(400).json({ message: schemaValidator.error });
            return;
        }

        schema.definition = schemaDefinition;
        schema.save((error, saveResult) => {
            if (!!error) {
                response.status(400).json(error);
                return;
            }

            response.status(200).json(saveResult);
        });
    });

};

export { schemaPost };
