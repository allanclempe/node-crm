import { createDiffieHellman } from "crypto";
import { Request, Response, Router } from "express";
import { sign } from "jsonwebtoken";
import * as mongoose from "mongoose";
import Environment, { IEnvironment, IEnvironmentModel } from "../core/environment";
import { CryptoHelper } from "../core/infrastructure/crypto.helper";
import { cleanupModel } from "../core/infrastructure/mongoose.helper";
import Project, { IProject } from "../core/project";
import User, { IUser } from "../core/user";
import { parameters } from "../environment/environment";

const identityRouter: Router = Router();

identityRouter.post("/user", (request: Request, response: Response) => {
    const model: IUser = request.body;
    const cfg = parameters();
    const user = new User(request.body);

    user.save((error, result) => {
        if (!!error) {
            return response.status(400).json(error);
        }

        return response.status(200).json(result);
    });
});

identityRouter.put("/user/:id", (request: Request, response: Response) => {

    const id = request.params.id;
    const userRequest = request.body;
    delete request.body.password;

    User.findByIdAndUpdate(id, userRequest, { new: true }, (error, user) => {

        if (!!error) {
            return response.status(400).json(error);
        }

        return response.status(200).json(user);
    });
});

identityRouter.post("/user/login", (request: Request, response: Response) => {

    const email = request.body.email;
    const password = request.body.password;
    const key = request.body.public_key;
    const cfg = parameters();

    User.findOne({ email, "permissions.god": true }, (userError, user) => {
        if (!!userError) {
            return response.status(400).json(userError);
        }

        const passwordHash = CryptoHelper.calculateHash(password, cfg.identity.secret);

        if (!user || user.password !== passwordHash) {
            return response.status(401).json({ error: "Unathorized" });
        }

        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        const token = sign(payload, cfg.identity.secret, {
            expiresIn: "1d",
        });

        return response.status(200).json({ token });

    });
});

identityRouter.post("/user/crm/login", (request: Request, response: Response) => {

    const email = request.body.email;
    const password = request.body.password;
    const key = request.body.public_key;
    const cfg = parameters();

    Environment.findOne({ key }, (envError, env) => {

        if (!!envError) {
            return response.status(400).json(envError);
        }

        if (!env) {
            return response.status(400).json({ error: `Environment not found` });
        }

        User.findOne({ email }, (userError, user) => {
            if (!!userError) {
                return response.status(400).json(userError);
            }

            const passwordHash = CryptoHelper.calculateHash(password, cfg.identity.secret);

            if (!user || user.password !== passwordHash) {
                return response.status(401).json({ error: "Unathorized" });
            }

            if (user.permissions.environmentIds.filter((id) => id.toString() === env.id).length === 0) {
                return response.status(401).json({
                    error: `User do not have permissions for '${env.name}' environment`,
                });
            }

            const payload = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                env: env.name,
                projectId: env.projectId,
            };

            const token = sign(payload, cfg.identity.secret, {
                expiresIn: env.tokenExpiresIn,
            });

            return response.status(200).json({ token });
        });

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
            projectId: project.id,
            tokenExpiresIn: "1d",
        };

        environments.push(env);
    }

    project.save((projError, result) => {

        if (!!projError) {
            return response.status(400).json(projError);
        }

        Environment.insertMany(environments, (envError, docs) => {

            if (!!envError) {
                return response.status(400).json(envError);
            }

            return response.status(200).json(result);
        });

    });
});

identityRouter.put("/project/:id", (request: Request, response: Response) => {

    const id = request.params.id;
    const projectRequest = request.body;

    User.findByIdAndUpdate(id, projectRequest, (error, project) => {

        if (!!error) {
            return response.status(400).json(error);
        }

        return response.status(200).json(project);
    });

});

identityRouter.post("/environment", (request: Request, response: Response) => {

    const env = new Environment(request.body);

    env.save((error, result) => {
        if (!!error) {
            return response.status(400).json(error);
        }

        return response.status(200).json(result);
    });
});

identityRouter.put("/environment/:id", (request: Request, response: Response) => {

    const id = request.params.id;
    const envRequest = request.body;

    Environment.findByIdAndUpdate(id, envRequest, { new: true }, (error, env) => {

        if (!!error) {
            return response.status(400).json(error);
        }

        return response.status(200).json(env);
    });
});

identityRouter.post("/environment/login", (request: Request, response: Response) => {

    const key = request.body.public_key;
    const cfg = parameters();

    Environment.findOne({ key }).then((env: IEnvironment) => {

        if (env == null) {
            return response.status(401).json({ error: "Unauthorized" });
        }
        const payload = { env: env.name, projectId: env.projectId };
        const token = sign(payload, cfg.identity.secret, {
            expiresIn: env.tokenExpiresIn,
        });

        return response.status(200).json({ token });

    });
});

export { identityRouter };
