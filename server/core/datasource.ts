import { Document, model, Schema, SchemaTypes, Types } from "mongoose";
import { IKeyValue } from "./keyvalue";

export interface IDataSource {
    name: string;
    environmentId: string;
    schemaId: string;
    fields: string[] | IKeyValue; /* use array<jpath> or key:jpath / value:jpath */
}

export interface IDataSourceModel extends Document, IDataSource {
}

export const DataSourceSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    environmentId: {
        required: true,
        type: String,
    },
    schemaId: {
        required: true,
        type: String,
    },
    defaultValue: String,
    fields: SchemaTypes.Mixed,
});

const DataSource = model<IDataSourceModel>("DataSource", DataSourceSchema);

export default DataSource;
