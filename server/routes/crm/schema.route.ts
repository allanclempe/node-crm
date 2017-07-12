import { Request, Response, Router } from "express";
import { Schema, ISchema } from "../../core";

const schemaPost = (request: Request, response: Response) => {

    const entityName = request.params.entity;
    const environmentId = request.body.environmentId;
    const schemaDefinition = request.body.definition;

    Schema.find({ name: entityName }, (err: any, queryResult: ISchema[]) => {

        const schema = !!queryResult.length
            ? new Schema(queryResult[0])
            : new Schema({ name: entityName, environmentId });

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
