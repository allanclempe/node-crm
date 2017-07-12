import { Document, Model, model, Schema, SchemaTypes, Types } from "mongoose";
import { FormFieldSchema, FormSchema } from "./schema/index";
import { IFormField } from "./formfield";

export interface IFormDocument extends Document, IForm {}
export interface IFormModel extends Model<IFormDocument> {}

export interface IForm extends Document {
    environmentId: string;
    schemaId: string;
    name: string;
    fields: IFormField[];
}


export const Form = <IFormModel> model("Form", FormSchema, "sys_form");
