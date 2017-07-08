import { Document, model, Schema } from "mongoose";
import { getModel } from "./infrastructure/mongoose.helper";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface IUserModel extends IUser, Document {
}

export const UserSchema = new Schema({
    firstName: {
        required: true,
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    }
});

const User = getModel<IUserModel>("sys_users", UserSchema);

export default User;
