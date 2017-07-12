import { Schema } from "mongoose";
import { FormFieldSchema } from "./";

export const FormSchema = new Schema({
    environmentId: {
        required: true,
        type: Schema.Types.ObjectId,
    },
    schemaId: {
        required: true,
        type: Schema.Types.ObjectId,
    },
    name: {
        required: true,
        type: String,
    },
    fields: [FormFieldSchema],
});
