import { DataSourceSchema} from "./";
import { Schema } from "mongoose";

export const FormFieldSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    jpath: {
        required: true,
        type: String,
    },
    type: {
        required: true,
        type: String,
    },
    defaultValue: String,
    dataSource: DataSourceSchema,
});
