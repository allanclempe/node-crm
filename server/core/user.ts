import { Document, model, Schema } from "mongoose";
import { IProject, ProjectSchema } from "./project";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    projects: IProject[];
}

export interface IUserModel extends IUser, Document {
}

export const UserSchema = new Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    projects: [ProjectSchema],
});

const User = model<IUserModel>("User", UserSchema);

export default User;
