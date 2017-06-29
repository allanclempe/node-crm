import { Document, model, Schema } from "mongoose";

export interface IEnvironment {
    name: string; /* production, staging, development */
    api: string;
    secret: string;
}

export interface IEnvironmentModel extends IEnvironment, Document {
}

export const EnvironmentSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    api: {
        required: true,
        type: String
    },
    secret: {
        required: true,
        type: String
    }
});

const Environment = model<IEnvironmentModel>("Environment", EnvironmentSchema);

export default Environment;
