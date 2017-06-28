import { Document, model, Schema, SchemaTypes } from "mongoose";
import * as mongoose from "mongoose";

export interface IDataDefinition {
    name: string;
    schemaDef: any;
}

export interface IDataDefinitionModel extends IDataDefinition, Document {
}

export const DataDefinitionSchema = new Schema({
    name: String,
    schemaDef: SchemaTypes.Mixed,
}, { strict: false });

export function validateSchema(schemaDef: any) {
    try {
        // validating schema.
        let schema = new mongoose.Schema(schemaDef);
        return { error: null, valid: true };
    } catch (ex) {
        return { error: ex.message, valid: false };
    }
}

const DataDefinition = model<IDataDefinitionModel>("dataDefinition", DataDefinitionSchema);

export default DataDefinition;
