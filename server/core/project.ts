import { Document, model, Model, Schema } from "mongoose";
import { ProjectSchema } from "./schema/project.schema";

export interface IProjectDocument extends IProject, Document {
}
export interface IProjectModel extends Model<IProjectDocument> {
}
export interface IProject {
    name: string;
    userId: string;
}

export const Project = <IProjectModel> model("Project", ProjectSchema, "sys_projects");
