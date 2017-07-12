import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import { cleanupModel } from "../../core/infrastructure/mongoose.helper";
import { Schema, ISchemaDocument } from "../../core";
import * as idValidator from "mongoose-id-validator";

const dataGet = (request: Request, response: Response) => {

    const entityName = request.params.entity;

    Schema.findOne({ name: entityName }, (err: any, schema: ISchemaDocument) => {

        if (!!err) {
            return response.status(400).json(err);
        }

        if (schema == null) {
            return response.status(400).json({ message: `Definition for '${entityName}' not found` });
        }

        const mongooseSchema = new mongoose.Schema(schema.definition);
        const entityModel = mongoose.model(entityName, mongooseSchema);
        entityModel.find((error, result) => {

            cleanupModel(entityName);

            if (!!error) {
                response.status(400).json(error);
                return;
            }

            response.status(200).json(result);
        });

    });

};

const dataPost = (request: Request, response: Response) => {

    const entityName = request.params.entity;
    const data = request.body;

    Schema.findOne({ name: entityName }, (err: any, schema: ISchemaDocument) => {

        if (!!err) {
            return response.status(400).json(err);
        }

        if (schema == null) {
            return response.status(400).json({ message: `Definition for '${entityName}' not found` });
        }

        const mongooseSchema = new mongoose.Schema(schema.definition);
        mongooseSchema.plugin(idValidator);
        const entityModel = mongoose.model(entityName, mongooseSchema);
        const entity = new entityModel(data);

        entity.save((error, result) => {

            cleanupModel(entityName);

            if (!!error) {
                return response.status(400).json(error);
            }

            return response.status(200).json(result);
        });

    });

};

const dataPut = (request: Request, response: Response) => {

    const entityName = request.params.entity;
    const id = request.params.id;
    const data = request.body;

    Schema.findOne({ name: entityName }, (err: any, schema: ISchemaDocument) => {
        if (!!err) {
            return response.status(400).json(err);
        }

        if (schema == null) {
            return response.status(400).json({ message: `Definition for '${entityName}' not found` });
        }

        const mongooseSchema = new mongoose.Schema(schema.definition);
        mongooseSchema.plugin(idValidator);
        const entityModel = mongoose.model(entityName, mongooseSchema);

        entityModel.findByIdAndUpdate(id, data, { new: true }, (error, result) => {

            cleanupModel(entityName);

            if (!!error) {
                return response.status(400).json(error);
            }

            if (!result) {
                return response.status(400).json({ error: `Entry id '${id}' not found for '${entityName}'"` });
            }

            return response.status(200).json(result);
        });
    });

};


export { dataGet, dataPost, dataPut };
