import { createDiffieHellman } from "crypto";
import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import Environment, { IEnvironment, IEnvironmentModel } from "../core/environment";
import { cleanupModel } from "../core/infrastructure/mongoose.helper";
import Project, { IProject } from "../core/project";
import User, { IUser } from "../core/user";

const identityRouter: Router = Router();

identityRouter.post("/user", (request: Request, response: Response) => {
    const user = new User(request.body);
    user.save((error, result) => {
        if (!!error) {
            response.status(400).json(error);
            return;
        }

        response.status(200).json(result);
        return;
    });
});

identityRouter.post("/project", (request: Request, response: Response) => {
    const project = new Project(request.body);

    const diffHell = createDiffieHellman(256);
    const environments: IEnvironment[] = [];
    const envNames = ["dev", "staging", "prod"];

    for (let envName of envNames) {

        diffHell.generateKeys("base64");

        let env: IEnvironment = {
            name: envName,
            key: diffHell.getPublicKey("base64"),
            secret: diffHell.getPrivateKey("base64"),
            projectId: project._id,
        };

        environments.push(env);
    }

    project.save((projError, result) => {

        if (!!projError) {
            response.status(400).json(projError);
            return;
        }

        Environment.insertMany(environments, (envError, docs) => {

            if (!!envError) {
                response.status(400).json(envError);
                return;
            }

            response.status(200).json(result);

        });

    });
});

identityRouter.post("/environment", (request: Request, response: Response) => {
    const env = new Environment(request.body);
    env.save((error, result) => {
        if (!!error) {
            response.status(400).json(error);
            return;
        }

        response.status(200).json(result);
        return;
    });
});

export { identityRouter };
