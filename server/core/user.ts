import { Document, Model, model, Schema } from "mongoose";
import { UserSchema } from "./schema/user.schema";
import { CryptoHelper } from "./infrastructure/crypto.helper";

export interface IUserDocument extends IUser, Document {
}

export interface IUserModel extends Model<IUserDocument> {
    createInstance(firstName: string, lastName: string, email: string): IUserDocument;
}

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    permissions: IUserPermissions;
    setAsGod();
    setPassword(password: string, salt: string);
    verifyPassword(password: string, salt: string);
    hasPermission(environmentId: string);
}

export interface IUserPermissions {
    environmentIds: string[];
    god: boolean;
}

export class UserClass implements IUser {
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public permissions: IUserPermissions;

    public static createInstance(firstName: string, lastName: string, email: string): IUserDocument {
        const user = new User({
            firstName,
            lastName,
            email,
            permissions: {
                god: false
            }
        });

        return user;
    }

    public setAsGod() {
        if (!this.permissions) {
            this.permissions = { environmentIds: [], god: false };
        }
        this.permissions.god = true;
    }
    public setPassword(password: string, salt: string) {
        this.password = CryptoHelper.calculateHash(password, salt);
    }
    public verifyPassword(password: string, salt: string) {
        const passwordHash = CryptoHelper.calculateHash(password, salt);
        return this.password === passwordHash;
    }
    public hasPermission(environmentId: string): boolean{
        return this.permissions.environmentIds.filter((id) => id.toString() === environmentId).length !== 0;
    }
}

UserSchema.loadClass(UserClass);

export const User = <IUserModel>model("User", UserSchema, "sys_users");
