import * as mongoose from "mongoose";
import { getModel } from "./infrastructure/mongoose.helper";

export interface ISchema {
    environmentId: string;
    name: string;
    definition: any;
    validateDefinition(definition: any);
}

export interface ISchemaModel extends mongoose.Document, ISchema {
}

const schemOptions = {strict: false};

export const SchemaSchema = new mongoose.Schema({
    environmentId: {
        required: true,
        type: String,
    },
    name: {
        required: true,
        type: String
    },
    definition: mongoose.SchemaTypes.Mixed,
}, schemOptions);

SchemaSchema.method("validateDefinition", (definition: any) => {
    try {
        let schema = new mongoose.Schema(definition);
        return { error: null, valid: true };
    } catch (ex) {
        return { error: ex.message, valid: false };
    }
});

const Schema = getModel<ISchemaModel>("Schema", SchemaSchema);

export default Schema;
