import { Document, Model, model, Schema, SchemaTypes, Types } from "mongoose";
import { DataSourceSchema } from "./schema/index";
import { IKeyValue } from "./keyvalue";

export interface IDataSourceDocument extends Document, IDataSource {};
export interface IDataSourceModel extends Model<IDataSourceDocument> {};

export interface IDataSource {
    name: string;
    environmentId: string;
    schemaId: string;
    fields: string[] | IKeyValue; /* use array<jpath> or key:jpath / value:jpath */
}

export const DataSource = <IDataSourceModel> model("DataSource", DataSourceSchema, "sys_datasource");
