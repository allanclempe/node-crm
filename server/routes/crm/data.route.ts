import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import { ISchemaDocument } from "../../core";
import { SchemaSchema } from "../../core/schema/schema.schema";
import * as idValidator from "mongoose-id-validator";

const dataGet = (request: Request, response: Response) => {
    const entityName = request.params.entity;
    const conn: mongoose.Connection = response.locals.conn;
    const models = conn.modelNames();

    if (models.indexOf(entityName) === -1) {
        return response.status(400).json({ message: `Definition for '${entityName}' not found` });
    }

    const entityModel = conn.model(entityName);

    entityModel.find((error, result) => {

        if (!!error) {
            response.status(400).json(error);
            return;
        }

        response.status(200).json(result);
    });


};

const dataPost = (request: Request, response: Response) => {

    const entityName = request.params.entity;
    const data = request.body;
    const conn: mongoose.Connection = response.locals.conn;
    const models = conn.modelNames();

    if (models.indexOf(entityName) === -1) {
        return response.status(400).json({ message: `Definition for '${entityName}' not found` });
    }

    const entityModel = conn.model(entityName);
    const entity = new entityModel(data);

    entity.save((error, result) => {

        if (!!error) {
            return response.status(400).json(error);
        }

        return response.status(200).json(result);
    });
};

const dataPut = (request: Request, response: Response) => {

    const entityName = request.params.entity;
    const id = request.params.id;
    const data = request.body;
    const conn: mongoose.Connection = response.locals.conn;
    const models = conn.modelNames();

    if (models.indexOf(entityName) === -1) {
        return response.status(400).json({ message: `Definition for '${entityName}' not found` });
    }

    const entityModel = conn.model(entityName);

    entityModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }, (error, result) => {

        if (!!error) {
            return response.status(400).json(error);
        }

        if (!result) {
            return response.status(400).json({ error: `Entry id '${id}' not found for '${entityName}'"` });
        }

        return response.status(200).json(result);
    });


};


const dataStats = (request: Request, response: Response) => {

    const entityName = request.params.entity;
    const conn: mongoose.Connection = response.locals.conn;
    const models = conn.modelNames();

    if (models.indexOf(entityName) === -1) {
        return response.status(400).json({ message: `Definition for '${entityName}' not found` });
    }

    const entityModel = conn.model(entityName);

    entityModel.collection.stats((error, stats) => {
        if (!!error) {
            return response.status(400).json(error);
        }
        return response.status(200).json(stats);
    });

};




export { dataGet, dataPost, dataPut, dataStats };
