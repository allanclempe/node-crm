import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import Schema, { ISchemaModel } from "../core/Schema";

const schemaRouter: Router = Router();

schemaRouter.post("/:entity", (request: Request, response: Response) => {

    const entityName = request.params.entity;
    const environmentId = request.body.environmentId;
    const schemaDefinition = request.body.definition;

    Schema.find({ name: entityName }, (err: any, queryResult: ISchemaModel[]) => {

        let schema = !!queryResult.length
            ? new Schema(queryResult[0])
            : new Schema({ name: entityName, environmentId });

        const definition = request.body.definition;
        const schemaValidator = schema.validateDefinition(definition);

        if (!schemaValidator.valid) {
            response.status(400).json({ message: schemaValidator.error });
            return;
        }

        schema.definition = definition;
        schema.save((error, saveResult) => {
            if (!!error) {
                response.status(400).json(error);
                return;
            }

            response.status(200).json(saveResult);
        });
    });

});

export { schemaRouter };
