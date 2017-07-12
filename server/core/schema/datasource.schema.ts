import { Schema, SchemaTypes } from "mongoose";

export const DataSourceSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    environmentId: {
        required: true,
        type: Schema.Types.ObjectId,
    },
    schemaId: {
        required: true,
        type: Schema.Types.ObjectId,
    },
    defaultValue: String,
    fields: SchemaTypes.Mixed,
});
