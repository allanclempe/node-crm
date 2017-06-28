import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import DataDefinition, { IDataDefinition, IDataDefinitionModel, validateSchema } from "../core/dataDefinition";
import entityModel from "../core/entityModel";

const dataDefRouter: Router = Router();

dataDefRouter.post("/:entity", (request: Request, response: Response) => {

    const entityName = request.params.entity;

    DataDefinition.find({ name: entityName }, (err: any, queryResult: IDataDefinitionModel[]) => {

        let dataDef = !!queryResult.length
        ? new DataDefinition(queryResult[0])
        : new DataDefinition({ name: entityName });

        const schemaDef = request.body;
        const schemaValidator = validateSchema(schemaDef);

        if (!schemaValidator.valid) {
            response.status(400).json({message: schemaValidator.error});
            return;
        }

        dataDef.schemaDef = schemaDef;
        dataDef.save((error, saveResult) => {
            if (!!error) {
                response.status(400).json(error);
                return;
            }

            entityModel.loadOne(entityName).then(() => {
                response.status(200).json(saveResult);
            });
 
        });
    });

});

export { dataDefRouter };
