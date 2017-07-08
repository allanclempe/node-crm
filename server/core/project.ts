import { Document, model, Schema } from "mongoose";
import { EnvironmentSchema, IEnvironment } from "./environment";
import { getModel } from "./infrastructure/mongoose.helper";

export interface IProject {
    name: string;
    userId: string;
}

export interface IProjectModel extends IProject, Document {
}

export const ProjectSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    userId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "sys_users",
    },
});

const Project = getModel<IProjectModel>("sys_projects", ProjectSchema);

export default Project;
