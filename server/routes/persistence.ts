import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import Schema, { ISchemaModel } from "../core/schema";

const persistenceRouter: Router = Router();

persistenceRouter.post("/:entity", (request: Request, response: Response) => {

    const entityName = request.params.entity;
    const data = request.body;

    Schema.findOne({ name : entityName }, (err: any, schema: ISchemaModel) => {

        // if (schema == null) {
        //     return response.status(400).json({message : `Definition for '${entityName}' not found`});
        // }

        // const mongooseSchema = new mongoose.Schema(schema.definition);
        // const entityModel = mongoose.model(entityName, mongooseSchema);
        // const entity = new entityModel(data);

        // entity.save((error, result) => {

        //     if (!!error) {
        //         response.status(400).json(error);
        //         return;
        //     }

        //     delete (<any> mongoose).connection.models[entityName];
        //     response.status(200).json(result);
        // });

    });

});

export { persistenceRouter };
