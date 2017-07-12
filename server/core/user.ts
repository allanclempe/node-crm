import { Document, Model, model, Schema } from "mongoose";
import { UserSchema } from "./schema/user.schema";

export interface IUserDocument extends IUser, Document {
}

export interface IUserModel extends Model<IUserDocument> {
    // static properties goes here;
}

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    permissions: IUserPermissions;
}

export interface IUserPermissions {
    environmentIds: string[];
}

export class UserClass implements IUser {
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public permissions: IUserPermissions;
}

UserSchema.loadClass(UserClass);

export const User = <IUserModel>model("User", UserSchema, "sys_users");
