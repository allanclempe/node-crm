import { Document, Model, model, Schema, SchemaTypes } from "mongoose";
import { FormFieldSchema } from "./schema/index";
import { IDataSource } from "./datasource";

export interface IFormFieldDocument extends IFormField, Document {
}

export interface IFormFieldModel extends Model<IFormFieldDocument> {
}

export interface IFormField {
    name: string;
    jpath: string;
    type: string; /* input type = hidden, text, select, radio, checkbox, email, date */
    defaultValue?: string;
    dataSource?: IDataSource;
}

export const FormField = <IFormFieldModel> model("FormField", FormFieldSchema, "sys_formfield");
