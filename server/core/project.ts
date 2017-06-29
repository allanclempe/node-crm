import { Document, model, Schema } from "mongoose";
import { EnvironmentSchema, IEnvironment } from "./environment";

export interface IProject {
    name: string;
    environments: IEnvironment[];
}

export interface IProjectModel extends IProject, Document {
}

export const ProjectSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    environments: [EnvironmentSchema],
});

const Project = model<IProjectModel>("Project", ProjectSchema);

export default Project;
