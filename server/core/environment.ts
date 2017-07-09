import { Document, model, Schema } from "mongoose";
import { getModel } from "./infrastructure/mongoose.helper";

export interface IEnvironment {
    name: string; /* production, staging, development */
    key: string;
    secret: string;
    projectId: string;
    tokenExpiresIn: string;
}

export interface IEnvironmentModel extends IEnvironment, Document {
}

export const EnvironmentSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    key: {
        required: true,
        type: String,
    },
    secret: {
        required: true,
        type: String,
    },
    projectId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "sys_projects",
    },
    tokenExpiresIn: {
        required: true,
        type: String,
    }
});

const Environment = getModel<IEnvironmentModel>("sys_environments", EnvironmentSchema);

export default Environment;
