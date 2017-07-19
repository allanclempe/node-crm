import { Document, model, Model, Schema } from "mongoose";
import { ProjectSchema } from "./schema/project.schema";
import { IUserDocument, IEnvironmentDocument } from "./";

export interface IProjectDocument extends IProject, Document {

}
export interface IProjectModel extends Model<IProjectDocument> {

}
export interface IProject {
    name: string;
    user: string | IUserDocument;
    environments: [string | IEnvironmentDocument];
    addEnvironment(environment: IEnvironmentDocument);
}

export class ProjectClass implements IProject {
    name: string;
    user: string | IUserDocument;
    environments: [string | IEnvironmentDocument];
    public addEnvironment(environment: IEnvironmentDocument) {
        (<IEnvironmentDocument[]>this.environments).push(environment);
    }
}

ProjectSchema.loadClass(ProjectClass);

export const Project = <IProjectModel>model("Project", ProjectSchema, "sys_projects");
