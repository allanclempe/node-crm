import { Document, model, Schema, SchemaTypes, Types } from "mongoose";
import { getModel } from "./infrastructure/mongoose.helper";
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
        type: String,
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

const DataSource = getModel<IDataSourceModel>("sys_datasource", DataSourceSchema);

export default DataSource;
