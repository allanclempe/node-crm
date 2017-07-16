import { model, Model, Document, Schema as mSchema } from "mongoose";
import { SchemaSchema } from "./schema/schema.schema";

export interface ISchemaDocument extends ISchema, Document {
}

export interface ISchemaModel extends Model<ISchemaDocument> {
}

export interface ISchema {
    name: string;
    definition: any;
    validateDefinition(definition: any);
}

export class SchemaClass implements ISchema {
    public name: string;
    public definition: any;
    validateDefinition(definition: any) {
        try {
            const schema = new mSchema(definition);
            return { error: null, valid: true };
        } catch (ex) {
            return { error: ex.message, valid: false };
        }
    }
}

SchemaSchema.loadClass(SchemaClass);
