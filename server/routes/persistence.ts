import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import DataDefinition, { IDataDefinitionModel } from "../core/dataDefinition";
import entityModel from "../core/entityModel";

const persistenceRouter: Router = Router();

persistenceRouter.post("/:entity", (request: Request, response: Response) => {

    const entityName = request.params.entity;
    const data = request.body;
    const model = entityModel.get(entityName);
    const entity = new model(data);

    entity.save((error, result) => {

        if (!!error) {
            response.status(400).json(error);
            return;
        }

        response.status(200).json(result);
    });

    // DataDefinition.findOne({ name : entityName }, (err: any, dataDef: IDataDefinitionModel) => {

    //     if (dataDef == null) {
    //         return response.status(400).json({message : `Definition for '${entityName}' not found`});
    //     }

    //     const schema = new mongoose.Schema(dataDef.schemaDef);
    //     const entityModel = mongoose.model(entityName, schema);
    //     const entity = new entityModel(data);

    //     entity.save((error, result) => {

    //         if (!!error) {
    //             response.status(400).json(error);
    //             return;
    //         }

    //         delete (<any> mongoose).connection.models[entityName];
    //         response.status(200).json(result);
    //     });

    // });

});

export { persistenceRouter };
