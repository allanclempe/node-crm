import { Request, Response, Router } from "express";
import { sign } from "jsonwebtoken";

import { IUser, User, Environment } from "../../core";
import { parameters } from "../../environment/environment";
import { CryptoHelper } from "../../core/infrastructure/crypto.helper";

export const userPost = (request: Request, response: Response) => {
    const model: IUser = request.body;
    const cfg = parameters();
    const user = User.createInstance(request.body.firstName, request.body.lastName, request.body.email);

    user.setPassword(request.body.password, cfg.identity.secret);
    user.setAsGod();

    user.save((error, result) => {
        if (!!error) {
            return response.status(400).json(error);
        }

        return response.status(200).json(result);
    });
};

export const userPut = (request: Request, response: Response) => {

    const id = request.params.id;
    const userRequest = request.body;
    delete request.body.password;

    User.findByIdAndUpdate(id, userRequest, { new: true, runValidators: true }, (error, user) => {

        if (!!error) {
            return response.status(400).json(error);
        }

        if (!user) {
            return response.status(400).json({ message: `Entry '${id}' not found` });
        }

        return response.status(200).json(user);
    });
};

export const userLogin = (request: Request, response: Response) => {

    const email = request.body.email;
    const password = request.body.password;
    const key = request.body.public_key;
    const cfg = parameters();

    User.findOne({ email, "permissions.god": true }, (userError, user) => {
        if (!!userError) {
            return response.status(400).json(userError);
        }

        if (!user || !user.verifyPassword(password, cfg.identity.secret)) {
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
};

export const userLoginCrm = (request: Request, response: Response) => {

    const email = request.body.email;
    const password = request.body.password;
    const key = request.body.public_key;
    const cfg = parameters();

    Environment.findOne({ key }).populate("project").exec((envError, env) => {

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

            if (!user || !user.verifyPassword(password, cfg.identity.secret)) {
                return response.status(401).json({ error: "Unathorized" });
            }

            if (!user.hasPermission(env.id)) {
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
                projectId: env.project,
                allowOrigin: env.allowOrigin,
            };

            const token = sign(payload, cfg.identity.secret, {
                expiresIn: env.tokenExpiresIn,
            });

            return response.status(200).json({ token });
        });

    });
};
