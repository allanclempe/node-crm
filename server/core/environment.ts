import { createDiffieHellman } from "crypto";
import { Document, Model, model, Schema } from "mongoose";
import { EnvironmentSchema } from "./schema/index";
import { IProjectDocument } from "./";

export interface IEnvironmentDocument extends IEnvironment, Document {
}

export interface IEnvironmentModel extends Model<IEnvironmentDocument> {
    createInstance(name: string, projectId: string);
}

export interface IEnvironment {
    name: string;
    key: string;
    secret: string;
    project: IProjectDocument | string;
    tokenExpiresIn: string;
    allowOrigin: string[];
    addOrigin(domain: string): void;
}

export class EnvironmentClass implements IEnvironment {

    public name: string;
    public key: string;
    public secret: string;
    public project: IProjectDocument | string;
    public tokenExpiresIn: string;
    public allowOrigin: string[];

    public static createInstance(name: string, project: IProjectDocument): IEnvironment {
        const securityToken = this.createKeySecret();
        const env = new Environment({
            name,
            key: securityToken.key,
            secret: securityToken.secret,
            project,
            tokenExpiresIn: "1d",
            allowOrigin: [],
        });

        env.addOrigin("*");

        return env;
    }

    private static createKeySecret = (): any => {
        const diffHell = createDiffieHellman(256);
        diffHell.generateKeys("base64");
        const key = diffHell.getPublicKey("base64");
        const secret = diffHell.getPrivateKey("base64");
        return { key, secret };
    }

    public addOrigin(domain: string): void {
        if (this.allowOrigin.indexOf(domain) !== -1) {
            return;
        }

        this.allowOrigin.push(domain);
    }
}

EnvironmentSchema.loadClass(EnvironmentClass);

export const Environment = <IEnvironmentModel>model("Environment", EnvironmentSchema, "sys_environments");
