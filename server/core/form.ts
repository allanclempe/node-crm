import { Document, model, Schema, SchemaTypes, Types } from "mongoose";
import { FormFieldSchema, IFormField } from "./formfield";

export interface IForm {
    environmentId: string;
    schemaId: string;
    name: string;
    fields: IFormField[];
}

export interface IFormModel extends Document, IForm {
}

export const FormSchema = new Schema({
    environmentId: {
        required: true,
        type: Types.ObjectId,
    },
    schemaId: {
        required: true,
        type: Types.ObjectId,
    },
    name: {
        required: true,
        type: String
    },
    fields:[FormFieldSchema],
});

const Form = model<IFormModel>("Form", FormSchema);

export default Form;
