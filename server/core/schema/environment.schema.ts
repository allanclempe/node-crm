import { Schema } from "mongoose";

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
    project: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "Project",
    },
    tokenExpiresIn: {
        required: true,
        type: String,
    },
    allowOrigin: [{ type: String, required: true }],
});
