import { Schema, SchemaTypes } from "mongoose";

const SchemaSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    definition: SchemaTypes.Mixed,
});

export { SchemaSchema };
